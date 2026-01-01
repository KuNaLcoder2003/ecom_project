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
app.use(cors());
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

