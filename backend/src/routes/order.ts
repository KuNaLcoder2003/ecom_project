import express from "express";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import authMiddleware from "../middlewares/authMiddleware.js";
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });
const orderRouter = express.Router();

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


export default orderRouter;