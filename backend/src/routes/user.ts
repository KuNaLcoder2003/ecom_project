import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { order, sign_in, sign_up, type Sign_In, type Sign_Up } from "@kunaljprsingh/ecom-types"
import getToken from "../function/generateToken.js";
const userRouter = express.Router();
import dotenv from "dotenv"
import authMiddleware from "../middlewares/authMiddleware.js";
import { ca } from "zod/locales";
dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({
    adapter
});

userRouter.post("/signup", async (req: express.Request, res: express.Response) => {
    try {
        const signup: Sign_Up = req.body;
        const { success } = sign_up.safeParse(signup)
        if (!success) {
            res.status(403).json({
                message: "Inavlid Types",
                valid: false
            })
            return
        }
        const user = await prisma.users.findFirst({
            where: {
                email: signup.email
            }
        })
        if (user) {
            res.status(402).json({
                message: "User already exsist , try Login",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const new_user = await tx.users.create({
                data: {
                    email: signup.email,
                    first_name: signup.first_name,
                    last_name: signup.last_name,
                    password: signup.password,
                    age: signup.age,
                    gender: signup.gender
                }
            })
            const new_address = await tx.address.create({
                data: {
                    user_id: new_user.id,
                    street: signup.street,
                    house_no: signup.house_no,
                    city: signup.city,
                    state: signup.state,
                    pin_code: signup.pincode,
                    land_mark: signup.land_mark
                }
            })
            return { new_user, new_address }
        }, { timeout: 20000, maxWait: 10000 })
        if (!response.new_address || !response.new_user) {
            res.status(403).json({
                message: "Unable to create account",
                valid: false,
            })
            return
        }
        const token = getToken(response.new_user.email, response.new_user.id);
        if (!token) {
            res.status(403).json({
                message: "Error signup",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Account created",
            valid: true,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

userRouter.post("/signin", async (req: express.Request, res: express.Response) => {
    try {
        const credentials: Sign_In = req.body;
        const { success } = sign_in.safeParse(credentials)
        if (!success) {
            res.status(403).json({
                message: "Invalid Credentials types",
                valid: false
            })
            return
        }

        const user = await prisma.users.findFirst({
            where: {
                email: credentials.email
            }
        })
        if (!user) {
            res.status(404).json({
                message: "User not found",
                valid: false
            })
            return
        }

        const token = getToken(user.email, user.id)
        if (!token) {
            res.status(403).json({
                message: "Unable to login",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Successfully LoggedIn",
            valid: true,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

userRouter.get("/addresses", authMiddleware, async (req: any, res: express.Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }
        const addresses = await prisma.address.findMany({
            where: {
                user_id: userId
            }
        })
        res.status(200).json({
            addresses: addresses,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

userRouter.get("/checkout/details", authMiddleware, async (req: any, res: express.Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }
        const details = await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: {
                    user_id: userId
                }
            })
            const cart_products = await tx.cart_products.findMany({
                where: {
                    cart_id: cart?.id
                },
                select: {
                    product_id: true,
                    qunatity: true,
                    price: true,
                }
            })
            const product = await tx.products.findMany({
                where: {
                    id: {
                        in: cart_products.map(item => {
                            return item.product_id
                        })
                    }
                },
                select: {
                    product_name: true,
                    product_description: true,
                    id: true,
                    images: true
                }
            })
            const products = product.map(item => {
                let temp = {};
                cart_products.map(obj => {
                    if (obj.product_id == item.id) {
                        temp = { ...item, qunatity: obj.qunatity, price: obj.price }
                    }
                })
                return temp
            })
            return { products, cart_products, cart }
        })
        if (!details.cart || !details.cart_products) {
            res.status(403).json({
                message: "Cart Unavailable",
                valid: false
            })
            return
        }
        if (!details.products) {
            res.status(403).json({
                message: "Unable to fetch Products",
                valid: false
            })
            return
        }
        res.status(200).json({
            products: details.products,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

userRouter.post('/admin/signin', async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                message: "Bad request"
            })
            return
        }
        if (email !== "kunalindia59@gmail.com") {
            res.status(401).json({
                message: "Unauthorized , wrong email",
                valid: false
            })
            return
        }
        if (password !== "KSJpr#Raj@45") {
            res.status(401).json({
                message: "Unauthorized, wrong password",
                valid: false
            })
            return
        }
        const token = getToken(email, "Admin")
        if (!token) {
            res.status(403).json({
                message: "Unable to signup",
                valid: false
            })
        }
        res.status(200).json({
            message: 'Logged in as admin',
            token: token,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
})

userRouter.get('/admin', async (req: express.Request, res: express.Response) => {
    try {
        const response = await prisma.$transaction(async (tx) => {
            const payments = await tx.payments.findMany({
                where: {
                    completed: true
                },
                select: {
                    amount: true
                }
            })

            const orders = await tx.order.findMany({
                where: {
                    OR: [
                        { status: "Payment Succesfull" },
                        { status: "Order Delivered" },
                        { status: "Order Shipped" }
                    ]
                },
                select: {
                    user: true,
                    payment: true,
                    status: true,
                    id: true
                }
            })

            const products = await tx.products.findMany({})
            const product_varinats = await tx.product_variants.findMany({})
            const users = await tx.users.findMany({})
            return { product_varinats, products, users, orders, payments }
        }, { timeout: 20000, maxWait: 10000 })

        const order_details = response.orders.map(item => {
            return {
                user_name: item.user.first_name + item.user.last_name,
                status: item.status,
                amount: item.payment?.amount,
                order_id: item.id
            }
        })

        res.status(200).json({
            products: response.products.length,
            product_variants: response.product_varinats.length,
            orders: response.orders.length,
            users: response.users.length,
            payment: response.payments.reduce((sum, b) => sum + b.amount, 0),
            order_details: order_details,
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

export default userRouter;