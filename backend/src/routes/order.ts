import express from "express";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import authMiddleware from "../middlewares/authMiddleware.js";
import Stripe from "stripe";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import ExcelJS from "exceljs";
const workbook = new ExcelJS.Workbook();
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });
const orderRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


interface ProductType {
    id: string;
    product_name: string;
    product_description: string;
}
interface ProductVariant {
    id: string;
    color: string;
    size: string;
    price: number;
    quantity: number
    product: ProductType
}

interface ProductImage {
    id: string
    product_id: string;
    image_url: string;
}

interface ProductObj {
    id: string;
    color: string;
    size: string;
    price: number;
    quantity: number
    product: ProductType;
    images: ProductImage[]
}
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
        console.log(userId)
        const adress_id: string = req.body.address_id as string;
        const cart_id: string = req.body.cart_id as string;
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
        console.log(user)
        const response = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    status: "Payment Pending",
                    user_id: user.id,
                    address_id: adress_id,
                    cart_id: cart_id
                }
            })

            const cart_products = await tx.cart_products.findMany({
                where: {
                    cart_id: newOrder.cart_id
                }
            })
            const product_ids = cart_products.map(item => {
                return item.product_variant_id
            })
            const products = await tx.product_variants.findMany({
                where: {
                    id: {
                        in: product_ids
                    }
                },
                select: {
                    size: true,
                    color: true,
                    id: true,
                    product: true
                }
            })
            const images = await tx.product_images.findMany({
                where: {
                    product_id: {
                        in: products.map(item => {
                            return item.product.id
                        })
                    }
                }
            })
            if (!cart_products) {
                throw new Error("Bad request")
            }
            const merged_arr = products.map((item) => {
                let temp: ProductVariant = { ...item, price: 0, quantity: 0 }
                cart_products.map((obj) => {
                    if (obj.product_variant_id == item.id) {
                        temp["price"] = obj.price
                        temp["quantity"] = obj.qunatity
                    }
                })
                return temp;
            })
            const final_arr = merged_arr.map((item) => {
                const temp: ProductObj = { ...item, images }
                images.map((obj) => {
                    if (obj.product_id == item.product.id) {
                        temp["images"] = [...temp["images"], obj]
                    }
                })
                return temp;
            })
            console.log("Final Arr : ", final_arr)
            const lineItems = final_arr.map(item => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.product.product_name,
                            description: item.product.product_name,
                            images: [item.images[0].image_url]
                        },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
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
            error: error,
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


            return { orders }
        }, { timeout: 20000, maxWait: 10000 })

        if (!response || !response.orders) {
            res.status(403).json({
                message: 'Unable to fetch orders',
                valid: false
            })
            return
        }
        res.status(200).json({
            order: response.orders,
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

orderRouter.post('/getOrderDetails/:orderId', adminMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const orderId = req.params.orderId;
        if (!orderId) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const ordered_products = await tx.ordered_products.findMany({
                where: {
                    order_id: orderId
                },
                select: {
                    product: true,
                    price: true,
                    qunatity: true
                }
            })
            const products_images = await tx.product_images.findMany({
                where: {
                    product_id: {
                        in: ordered_products.map(item => { return item.product.id })
                    }
                }
            })

            return { ordered_products, products_images }
        }, { timeout: 20000, maxWait: 10000 })
        if (!response || !response.ordered_products || !response.products_images) {
            res.status(403).json({
                message: "Unable to fetch ordered products",
                valid: false
            })
            return
        }
        let merged_arr = response.ordered_products.map(item => {
            let temp_obj = { ...item, images: [""] }
            response.products_images.map(obj => {
                if (obj.product_id == item.product.id) {
                    temp_obj.images = [...temp_obj.images, obj.image_url].filter(item => item.length > 0)
                }
            })
            return temp_obj;
        })
        res.status(200).json({
            ordered_products: merged_arr,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

orderRouter.get('/orderHistrory', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const userId = "req.userId"
        const response = await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany({
                where: {
                    user_id: userId
                }
            })
            return { orders }
        }, { timeout: 20000, maxWait: 10000 })
        if (!response || !response.orders) {
            res.status(403).json({
                message: "Unable to get order history",
                valid: false
            })
            return
        }
        res.status(200).json({
            orders: response.orders,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

orderRouter.get('/admin/orderDetails', adminMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const response = await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany({
                select: {
                    id: true,
                    user: true,
                    status: true,
                    ordered_product: true
                }
            });

            return {
                orders
            }
        })

        if (!response || !response.orders) {
            res.status(403).json({
                message: "Unable to fetch orders",
                valid: false
            })
            return
        }
        res.status(200).json({
            orders: response.orders,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Something went wrong",
            valid: false
        })
    }
})

orderRouter.get('/admin/downloadOrders', adminMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const worksheet = workbook.addWorksheet("orders");
        const response = await prisma.$transaction(async (tx) => {
            const orders = await tx.order.findMany({
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            first_name: true
                        }
                    },
                    status: true,
                    ordered_product: true
                }
            });

            return {
                orders
            }
        })

        if (!response || !response.orders) {
            res.status(403).json({
                message: "Unable to fetch orders",
                valid: false
            })
            return
        }
        worksheet.columns = [
            { header: "Order ID", key: "id", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "User Name", key: "userName", width: 25 },
            { header: "User ID", key: "userId", width: 15 },
            { header: "Products Count", key: "productCount", width: 18 },
            { header: "Order Value", key: "amount", width: 18 }
        ];
        response.orders.forEach(order => {
            worksheet.addRow({
                id: order.id,
                status: order.status,
                userName: order.user.first_name,
                userId: order.user.id,
                productCount: order.ordered_product.length,
                amount: order.ordered_product.reduce((sum, b) => sum + b.price * b.qunatity, 0)
            });
        })
        worksheet.getRow(1).font = { bold: true };
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=orders.xlsx"
        );

        // Send file
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            message: "Something went wrong",
            valid: false
        })
    }
})



export default orderRouter;