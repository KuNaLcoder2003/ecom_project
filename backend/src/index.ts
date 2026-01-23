import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from "dotenv"
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import sendMail from "./function/mail.js";
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
        console.log(`Webhook signature verification failed.`, err);
        return res.sendStatus(400);
    }

    if (event.type == 'checkout.session.completed') {
        try {
            let total;
            const response_object = event.data.object;
            const order_id = response_object.metadata?.order_id
            const user_id = response_object.metadata?.user_id;
            const user = await prisma.users.findUnique({
                where: {
                    id: user_id
                }
            })
            const cart_id = response_object.metadata?.cart_id;

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
                if (order?.status === "Payment Succesfull") {
                    return;
                }

                const cart_products = await tx.cart_products.findMany({
                    where: {
                        cart_id: order?.cart_id
                    },
                })
                total = cart_products.reduce((sum, curr) => sum + curr.price * curr.qunatity, 0)

                const updated = await Promise.all(cart_products.map(async (item) => {
                    const product = await tx.product_variants.findUnique({
                        where: { id: item.product_variant_id },
                        select: { quantity: true },
                    });
                    if (!product) {
                        throw new Error('Product not found');
                    }

                    if (product.quantity < item.qunatity) {
                        throw new Error('Insufficient stock');
                    }

                    const result = await tx.product_variants.updateMany({
                        where: {
                            id: item.product_variant_id,
                            quantity: { gte: item.qunatity }
                        },
                        data: {
                            quantity: {
                                decrement: item.qunatity
                            }
                        }
                    })
                    console.log(result)
                    if (result.count == 0) {
                        throw new Error('Insufficient stock');
                    }
                    return result
                }))
                if (!updated) {
                    throw new Error('Unable to update product');
                }
                const results = await Promise.all(cart_products.map(async (item) => {
                    const new_entry = await tx.ordered_products.create({
                        data: {
                            product_id: item.product_id,
                            qunatity: item.qunatity,
                            order_id: order_id,
                            price: item.price
                        }
                    })
                    if (!new_entry) {
                        throw new Error("Unable to update the order")
                    }
                    return new_entry
                }))
                if (!results) {
                    throw new Error('Unable to update product');
                }

                await tx.order.update({
                    where: {
                        id: order_id
                    },
                    data: {
                        status: "Payment Succesfull"
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
                await tx.cart_products.deleteMany({
                    where: {
                        cart_id: cart_id
                    }
                })

                return { updated }

            }, { timeout: 20000, maxWait: 10000 })
            if (!response || !response?.updated) {
                return res.status(400).json({ received: false });
            }
            //             await sendMail(user?.email!, `<!DOCTYPE html>
            // <html>
            //   <head>
            //     <meta charset="UTF-8" />
            //     <title>Order Confirmation</title>
            //   </head>

            //   <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
            //     <table width="100%" cellpadding="0" cellspacing="0">
            //       <tr>
            //         <td align="center" style="padding: 20px 0;">

            //           <!-- Main Container -->
            //           <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">

            //             <!-- Header -->
            //             <tr>
            //               <td style="background-color: #4f46e5; padding: 20px; text-align: center;">
            //                 <h1 style="color: #ffffff; margin: 0;">Order Confirmed 🎉</h1>
            //               </td>
            //             </tr>

            //             <!-- Content -->
            //             <tr>
            //               <td style="padding: 30px;">
            //                 <p style="font-size: 16px; color: #333333;">
            //                   Hi <strong>Customer</strong>,
            //                 </p>

            //                 <p style="font-size: 16px; color: #333333;">
            //                   Thank you for your purchase! Your order has been successfully placed.
            //                 </p>

            //                 <!-- Order Details -->
            //                 <table width="100%" cellpadding="10" cellspacing="0" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 6px;">
            //                   <tr style="background-color: #f9fafb;">
            //                     <td style="font-weight: bold; color: #374151;">Order ID</td>
            //                     <td style="color: #111827;">${order_id}</td>
            //                   </tr>
            //                   <tr>
            //                     <td style="font-weight: bold; color: #374151;">Total Amount Paid</td>
            //                     <td style="color: #111827;">₹ ${total}</td>
            //                   </tr>
            //                 </table>

            //                 <p style="font-size: 16px; color: #333333;">
            //                   We’ll notify you once your order is shipped.
            //                 </p>

            //                 <p style="font-size: 16px; color: #333333;">
            //                   If you have any questions, feel free to reach out to our support team.
            //                 </p>

            //                 <p style="font-size: 16px; color: #333333;">
            //                   Regards,<br />
            //                   <strong>Your Store Team</strong>
            //                 </p>
            //               </td>
            //             </tr>

            //             <!-- Footer -->
            //             <tr>
            //               <td style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 14px; color: #6b7280;">
            //                 © 2026 Your Store. All rights reserved.
            //               </td>
            //             </tr>

            //           </table>

            //         </td>
            //       </tr>
            //     </table>
            //   </body>
            // </html>
            // ` , "Order Confirmed")
            return res.status(200).json({ received: true });
        } catch (err) {
            console.log(err)
            res.status(400).json({
                message: "Unable to process error",
                valid: false
            })
            return
        }
    }


})
app.use(express.json());


app.use("/api/v1", router);
app.listen(4000, () => {
    console.log("App started");
})

