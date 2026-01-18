import express from 'express'
const cartRouter = express.Router()
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import { cart } from '@kunaljprsingh/ecom-types';
import authMiddleware from '../middlewares/authMiddleware.js';
import { cart_product_availability } from '../function/checkAvailabilty.js';
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

interface Cart {
    product_variant_id: string;
    product_id: string
    quantity: number;
    price: number;
}
interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}
interface Cart_Type {
    cart_id: string;
    product_id: string;
    product_variant_id: string;
    qunatity: number;
    price: number;
    images: ProductImage[]

}
interface Cart_Product {
    product_variant_id: string,
    requested_qunatity: number
}


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
        const product = await prisma.product_variants.findFirst({
            where: {
                id: product_details.product_variant_id
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
            if (existing && existing.qunatity + product_details.quantity > product?.quantity) {
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
                    product_variant_id: product_details.product_variant_id,
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
            valid: true
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/products', authMiddleware, async (req: any, res: express.Response) => {
    const userId = req.userId
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                user_id: userId
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

        const products_arr = await prisma.products.findMany({
            where: {
                id: {
                    in: product_ids
                }
            }
        })

        const products = await prisma.product_images.findMany({
            where: {
                product_id: {
                    in: product_ids
                }
            }
        })
        const cart_product_list = cart_products.map((item) => {
            let temp: any = { ...item }
            products.map((obj) => {
                if (item.product_id == obj.product_id) {
                    if (temp["images"]) {
                        temp.images = [...temp.images, obj]
                    } else {
                        temp["images"] = [obj]
                    }
                }
            })
            return temp;
        })
        const finalArr = cart_product_list.map(item => {
            let temp: any = { ...item }
            products_arr.map(obj => {
                if (obj.id == item.product_id) {
                    temp["product_name"] = obj.product_name
                }
            })
            return temp
        })
        res.status(200).json({
            cart: finalArr,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

cartRouter.get('/count/:productId', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const product_id = req.params.productId
        if (!product_id) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const cart = await prisma.cart.findUnique({
            where: {
                id: ""
            }
        })

        if (!cart) {
            res.status(400).json({
                message: "Cart does not exists, nothing to delete",
                valid: false
            })
            return
        }
        const repsonse = await prisma.$transaction(async (tx) => {
            const product_count = await tx.cart_products.findUnique({
                where: {
                    cart_id_product_id: {
                        cart_id: cart.id,
                        product_id: req.params.productId
                    }
                },
                select: {
                    qunatity: true
                }
            })
            return { product_count }
        })
        if (!repsonse.product_count) {
            res.status(404).json({
                message: "Product not found",
                valid: false
            })
            return
        }
        res.status(200).json({
            count: repsonse.product_count.qunatity,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

cartRouter.delete('/:productId', authMiddleware, async (req: any, res: express.Response) => {
    try {
        const product_id = req.params.productId
        if (!product_id) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const cart = await prisma.cart.findUnique({
            where: {
                id: req.userId
            }
        })

        if (!cart) {
            res.status(400).json({
                message: "Cart does not exists, nothing to delete",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const updated_cart = await tx.cart_products.delete({
                where: {
                    cart_id_product_id: {
                        cart_id: cart.id,
                        product_id: product_id
                    }
                }
            })
            return { updated_cart }
        })
        if (!response.updated_cart) {
            res.status(403).json({
                message: "Unable to delete the product",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Product deleted",
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

cartRouter.post('/checkout', authMiddleware, async (req: express.Request, res: express.Response) => {
    try {
        const userId = "req.userId";
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }

        const cart: Cart_Type[] = req.body.cart;
        const products: Cart_Product[] = cart.map(product => {
            return {
                product_variant_id: product.product_variant_id,
                requested_qunatity: product.qunatity
            }
        })
        // first check all product's quantity , if the qunatity from cart is more than quantity from DB -> throw error to user that some products are not availble in stock
        // if not then -> all okay , start a session
        const response = await prisma.$transaction(async (tx) => {
            const arr = await cart_product_availability(tx, products);
            return { arr };
        })

        if (response.arr.length > 0) {
            res.status(403).json({
                message: "Some of the cart products are limited/unavailable in stock",
                unavailable: response.arr,
                valid: false
            })
        }
        res.status(200).json({
            message: "Proceeding to checkout",
            valid: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})
export default cartRouter;