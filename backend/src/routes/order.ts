import express from "express";
import { PrismaPg } from '@prisma/adapter-pg'
import { cart_products, PrismaClient } from '@prisma/client';
import authMiddleware from "../middlewares/authMiddleware.js";
import Stripe from "stripe";
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

orderRouter.post('/createOrder', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const userId = "req.userId";
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
            return { newOrder };
        })
        if (!response.newOrder) {
            res.status(400).json({
                message: "Unable to create order",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Success",
            order_id: response.newOrder.id
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

orderRouter.post('/payAndConfirm/:orderId', authMiddleware, async (req: express.Request, res: express.Response) => {
    // this route will create a payment intent and generate a client id for stripe sdk 
    // once the user pays -> webhook will confirm the payment -> if success ,  then decrement the quantity of products ,  if not ->  then roll back changes
    try {
        const userId = "req.userId";
        const orderId = req.params.orderId;
        if (!userId) {
            res.status(403).json({
                message: "Unauthorized",
                valid: false
            })
            return
        }
        const cart = req.body.cart as cart_products[]
        if (!cart) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }

        const response = await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: {
                    id: orderId
                }
            })
            const cart_products = await tx.cart_products.findMany({
                where: {
                    cart_id: order?.cart_id
                }
            })
            if (!order || !cart_products) {
                throw new Error("Bad request")
            }
            const stripe_response = await stripe.paymentIntents.create({
                amount: cart_products.reduce((sum, b) => sum + b.price * b.qunatity, 0),
                currency: "inr",
                automatic_payment_methods: {
                    enabled: true
                },
                metadata: {
                    orderId: order.id,
                    userId: userId,
                }
            })
            if (!stripe_response) {
                throw new Error("Error generating payment")
            }
            const payment = await tx.payments.create({
                data: {
                    order_id: order.id,
                    user_id: userId,
                    amount: cart_products.reduce((sum, b) => sum + b.price * b.qunatity, 0),
                    completed: false,
                    created_at: new Date(),
                    stripe_id: stripe_response.id
                }
            })
            return { stripe_response, payment }
        })
        if (!response.stripe_response) {
            res.status(403).json({
                message: "Unable to create payment",
                valid: false
            })
            return
        }
        res.status(200).json({
            clientSecret: response.stripe_response.client_secret
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
})


export default orderRouter;