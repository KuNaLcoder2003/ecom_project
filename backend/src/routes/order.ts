import express from "express";
import { PrismaPg } from '@prisma/adapter-pg'
import { cart_products, PrismaClient } from '@prisma/client';
import authMiddleware from "../middlewares/authMiddleware.js";
import Stripe from "stripe";
import { success } from "zod";
import adminMiddleware from "../middlewares/adminMiddleware.js";
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });
const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
orderRouter.post('/cart', authMiddleware, async (req: express.Request, res: express.Response) => {
    // THIS ROUTE IS FOR ORDERING FROM CART
    try {
        const userId = "req.userId"
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

orderRouter.post('/createOrder', authMiddleware, async (req: any, res: express.Response) => {
    try {
        const userId = req.userId;
        const adress_id: string = req.headers.address_id as string;
        const cart_id: string = req.headers.cart_id as string;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized",
                valid: false
            })
            return
        }
        const user = await prisma.users.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({
                message: "User not found",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    user_id: userId,
                    status: false,
                    address_id: adress_id,
                    cart_id: cart_id,
                }
            })

            const cart_products = await tx.cart_products.findMany({
                where: {
                    cart_id: newOrder.cart_id
                }
            })
            const product_ids = cart_products.map(item => {
                return item.product_id
            })
            if (!cart_products) {
                throw new Error("Bad request")
            }



            const lineItems = cart_products.map(item => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.product_id,
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.qunatity,
                }
            })

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: lineItems,
                mode: "payment",
                success_url: 'http://localhost:5173/success',
                cancel_url: 'http://localhost:5173/fail',
                metadata: {
                    order_id: newOrder.id,
                    cart_id: cart_id,
                    user_id: userId
                }
            })

            if (!session) {
                throw new Error("Error generating payment")
            }
            const payment = await tx.payments.create({
                data: {
                    order_id: newOrder.id,
                    user_id: userId,
                    amount: cart_products.reduce((sum, b) => sum + b.price * b.qunatity, 0),
                    completed: false,
                    created_at: new Date(),
                    stripe_id: session.id
                }
            })
            return { newOrder, session, payment };
        }, { timeout: 20000, maxWait: 10000 })
        if (!response.newOrder) {
            res.status(400).json({
                message: "Unable to create order",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Success",
            order_id: response.newOrder.id,
            session_url: response.session.url
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

orderRouter.post('/getAllOrders', adminMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const role = "req.role";
        if (!role) {
            res.status(401).json({
                message: 'Unauthorized'
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany();
            console.log(orders)

            const ordered_products = await tx.ordered_products.findMany({
                where: {
                    order_id: {
                        in: orders.map(item => { return item.id })
                    }
                },
                select: {
                    product: true, // this object will have the quantity that is in stock
                    order: true,
                    qunatity: true // this quantity is the qunatity ordered by user
                }
            })
            return { ordered_products }
        }, { timeout: 20000, maxWait: 10000 })
        console.log(response.ordered_products)
        if (!response || !response.ordered_products) {
            res.status(403).json({
                message: 'Unable to fetch orders',
                valid: false
            })
            return
        }
        res.status(200).json({
            orders: response.ordered_products,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: 'Something went wrong',
            valid: false
        })
    }
})

// orderRouter.post('/payAndConfirm/:orderId', authMiddleware, async (req: any, res: express.Response) => {
//     // this route will create a payment intent and generate a client id for stripe sdk 
//     // once the user pays -> webhook will confirm the payment -> if success ,  then decrement the quantity of products ,  if not ->  then roll back changes
//     try {
//         const userId = req.userId;
//         const orderId = req.params.orderId;
//         if (!userId) {
//             res.status(403).json({
//                 message: "Unauthorized",
//                 valid: false
//             })
//             return
//         }
//         // const cart = req.body.cart as cart_products[]
//         // if (!cart) {
//         //     res.status(400).json({
//         //         message: "Bad request",
//         //         valid: false
//         //     })
//         //     return
//         // }

//         const response = await prisma.$transaction(async (tx) => {
//             const order = await tx.order.findUnique({
//                 where: {
//                     id: orderId
//                 }
//             })
//             const cart_products = await tx.cart_products.findMany({
//                 where: {
//                     cart_id: order?.cart_id
//                 }
//             })
//             const product_ids = cart_products.map(item => {
//                 return item.product_id
//             })
//             if (!order || !cart_products) {
//                 throw new Error("Bad request")
//             }



//             const lineItems = cart_products.map(item => {
//                 return {
//                     price_data: {
//                         currency: 'inr',
//                         product_data: {
//                             name: item.product_id,
//                         },
//                         unit_amount: item.price * 100,
//                     },
//                     quantity: item.qunatity,
//                 }
//             })

//             const session = await stripe.checkout.sessions.create({
//                 payment_method_types: ["card"],
//                 line_items: lineItems,
//                 mode: "payment",
//                 success_url: 'http://localhost:5173/success',
//                 cancel_url: 'http://localhost:5173/fail',
//             })

//             if (!session) {
//                 throw new Error("Error generating payment")
//             }
//             const payment = await tx.payments.create({
//                 data: {
//                     order_id: order.id,
//                     user_id: userId,
//                     amount: cart_products.reduce((sum, b) => sum + b.price * b.qunatity, 0),
//                     completed: false,
//                     created_at: new Date(),
//                     stripe_id: session.id
//                 }
//             })
//             return { session, payment }
//         }, { timeout: 20000, maxWait: 10000 })
//         console.log(response.session);
//         if (!response.session) {
//             res.status(403).json({
//                 message: "Unable to create payment",
//                 valid: false
//             })
//             return
//         }
//         res.status(200).json({
//             clientSecret: response.session.id
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: error,
//             message: "Something went wrong"
//         })
//     }
// })


export default orderRouter;