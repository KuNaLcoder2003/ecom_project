import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from "dotenv"
import bodyParser from "body-parser";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const STRIPE_WEBHOOK_SECRET_KEY = process.env.STRIPE_WEBHOOK_SECRET!;
app.use(cors());
app.post('/webhook/verify', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
    let event: Stripe.Event
    try {
        const signature = req.headers['stripe-signature'] as string;
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            STRIPE_WEBHOOK_SECRET_KEY
        )
    } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err);
        return res.sendStatus(400);
    }

    if (event.type == 'checkout.session.completed') {
        try {
            const response_object = event.data.object;
            const order_id = response_object.metadata?.order_id
            if (!order_id) {
                return res.status(400).send('Missing order_id');
            }

            const response = await prisma.$transaction(async (tx) => {
                const order = await tx.order.findUnique({
                    where: {
                        id: order_id
                    },
                    select: {
                        cart_id: true,
                        status: true
                    }
                })
                if (!order) throw new Error('Order not found');
                if (order?.status === true) {
                    return;
                }

                const cart_products = await tx.cart_products.findMany({
                    where: {
                        cart_id: order?.cart_id
                    },

                })

                const updated = await Promise.all(cart_products.map(async (item) => {
                    const product = await tx.products.findUnique({
                        where: { id: item.product_id },
                        select: { quantity: true },
                    });
                    if (!product) {
                        throw new Error('Product not found');
                    }

                    if (product.quantity < item.qunatity) {
                        throw new Error('Insufficient stock');
                    }

                    const result = await tx.products.updateMany({
                        where: {
                            id: item.product_id,
                            quantity: { gte: item.qunatity }
                        },
                        data: {
                            quantity: {
                                decrement: item.qunatity
                            }
                        }
                    })
                    if (result.count == 0) {
                        throw new Error('Insufficient stock');
                    }
                    return result
                }))
                if (!updated) {
                    throw new Error('Unable to update product');
                }

                await tx.order.update({
                    where: {
                        id: order_id
                    },
                    data: {
                        status: true
                    }
                })
                await tx.payments.update({
                    where: {
                        order_id: order_id
                    },
                    data: {
                        completed: true
                    }
                })
                return { updated }

            }, { timeout: 20000, maxWait: 10000 })
            if (!response || !response?.updated) {
                return res.status(200).json({ received: false });
            }
            return res.status(200).json({ received: true });
        } catch (err) {

        }
    }

    res.status(200).json({
        message: 'Order confirmed',
        valid: true
    })
})
app.use(express.json());



async function finalizeOrder(intent: Stripe.PaymentIntent) {
    const orderId = intent.metadata.order_id
    const cartId = intent.metadata.cart_id
    await prisma.$transaction(async (tx) => {
        const cart_products = await tx.cart_products.findMany({
            where: {
                cart_id: cartId
            }
        })

        if (!cart_products) {
            throw new Error("Error occured while processing the payment")
        }
        for (const item of cart_products) {
            await tx.products.updateMany({
                where: {
                    id: item.product_id
                },
                data: {
                    quantity: {
                        decrement: item.qunatity
                    }
                }
            })
        }
        await tx.order.update({
            where: {
                id: orderId
            },
            data: {
                status: true
            }
        })
        await tx.payments.update({
            where: {
                order_id: orderId
            },
            data: {
                completed: true
            }
        })
    })

}
app.post('/webhooks/stripe', bodyParser.raw({ type: "application/json" }), async (req: express.Request, res: express.Response) => {
    try {
        const sig = req.headers["stripe-signature"]
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        if (event.type === "payment_intent.succeeded") {
            const intent = event.data.object;

            await finalizeOrder(intent);
            res.status(200).json({ received: true });
            return
        }

    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
})
app.use("/api/v1", router);
app.listen(3000, () => {
    console.log("App started");
})

