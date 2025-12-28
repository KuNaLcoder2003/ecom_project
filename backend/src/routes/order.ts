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
    } catch (error) {

    }
})

export default orderRouter;