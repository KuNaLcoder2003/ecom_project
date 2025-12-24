import express from "express";
import userRouter from "./user.js";
import orderRouter from "./order.js";
import productsRouter from "./product.js";
import cartRouter from "./cart.js";

const router = express.Router();
router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/product", productsRouter);
router.use('/cart', cartRouter);

export default router;