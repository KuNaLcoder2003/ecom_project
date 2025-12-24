import express from 'express'
const cartRouter = express.Router()
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import { type Cart, cart } from '@kunaljprsingh/ecom-types';
import authMiddleware from '../middlewares/authMiddleware.js';
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

cartRouter.post('/', authMiddleware, async (req: any, res: express.Response) => {
    try {
        const product_details: Cart = req.body;
        let new_cart_id: string = "";
        let cartId: string = "";
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized",
                valid: false
            })
        }
        const { success } = cart.safeParse(product_details);
        if (!success) {
            return res.status(403).json({
                message: "Invalid cart type",
                valid: false
            })
        }
        const product = await prisma.products.findFirst({
            where: {
                id: product_details.product_id
            }
        })
        if (!product) {
            return res.status(404).json({
                message: "No product exixts",
                valid: false,
            })
        }
        if (product_details.quantity > product.quantity || product.quantity == 0) {
            res.status(403).json({
                message: "Insufficient Qunatity",
                valid: true
            })
            return
        }

        const cart_exists = await prisma.cart.findFirst({
            where: {
                user_id: userId
            }
        })


        if (!cart_exists) {
            const response = await prisma.$transaction(async (tx) => {
                const new_cart = await tx.cart.create({
                    data: {
                        user_id: userId
                    }
                })

                return { new_cart }
            }, { timeout: 20000, maxWait: 10000 })


            if (!response.new_cart) {
                return res.status(400).json({
                    message: "Unable to add to cart",
                    valid: false
                })
            }
            new_cart_id = response.new_cart.id

        }
        cartId = cart_exists ? cart_exists.id : new_cart_id
        const result = await prisma.$transaction(async (tx) => {
            const existing = await prisma.cart_products.findUnique({
                where: {
                    cart_id_product_id: {
                        cart_id: cartId,
                        product_id: product_details.product_id
                    }
                }
            })
            if (existing && existing.qunatity + product_details.quantity > product.quantity) {
                // console.log("Hereee i am ")
                throw new Error("INSUFFICIENT_STOCK")
            }
            const cart_products = await tx.cart_products.upsert({
                where: {
                    cart_id_product_id: {
                        cart_id: cartId,
                        product_id: product_details.product_id
                    }
                },
                update: {
                    qunatity: {
                        increment: product_details.quantity
                    }
                },
                create: {
                    cart_id: cartId,
                    product_id: product_details.product_id,
                    qunatity: product_details.quantity,
                    price: product_details.price
                }
            })
            return { cart_products }
        })
        if (!result.cart_products) {
            res.status(402).json({
                message: "Unable to add to cart",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Added to cart",
            valid: false
        })


    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/:cartId', async (req: express.Request, res: express.Response) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                id: req.params.cartId
            }
        })
        if (!cart) {
            return res.status(404).json({
                message: "Cart not initialized",
                valid: false
            })
        }
        const cart_products = await prisma.cart_products.findMany({
            where: {
                cart_id: cart.id
            }
        })
        if (cart_products.length == 0) {
            return res.status(200).json({
                message: 'Cart empty',
                valid: true
            })
        }
        const product_ids = cart_products.map(item => {
            return item.product_id
        })

        const products = await prisma.products.findMany({
            where: {
                id: {
                    in: product_ids
                }
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})
export default cartRouter;