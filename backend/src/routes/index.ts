import express from "express";
import userRouter from "./user.js";
import orderRouter from "./order.js";
import productsRouter from "./product.js";

const router = express.Router();
router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/product", productsRouter);

export default router;