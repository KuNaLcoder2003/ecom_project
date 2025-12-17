import express from "express";
const productsRouter = express.Router();
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { post_product, type Product } from "@kunaljprsingh/ecom-types";
import multer from "multer"
import dotenv from "dotenv"
dotenv.config()
import { uploadMultipleAssets } from "../function/cloudinary.js";
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const prisma = new PrismaClient({
    adapter
})


productsRouter.post('/', upload.array('images'), async (req: express.Request, res: express.Response) => {
    try {
        const product_deatils: Product = req.body;
        const images = req.files as Express.Multer.File[]
        let body = {
            product_name: product_deatils.product_name,
            product_description: product_deatils.product_description,
            price: Number(product_deatils.price),
            qunatity: Number(product_deatils.qunatity)
        }
        let buffer: Buffer[] = [];
        const { success } = post_product.safeParse(body);
        if (!success) {
            res.status(403).json({
                message: "Invalid Types"
            })
            return
        }
        if (!images || images.length == 0) {
            res.status(403).json({
                message: "Provide at least one image"
            })
            return
        }
        buffer = (images.map((item) => {
            return Buffer.from(item.buffer)
        }))
        const { passed, failed } = await uploadMultipleAssets(buffer);
        console.log("01")
        if (failed.length > 0) {
            return res.status(403).json({
                message: "Failed to upload on cloud",
                err: "Upload error",
                failed: failed,
                valid: false
            });
        }
        console.log("02")
        const response = await prisma.$transaction(async (tx) => {
            const product = await tx.products.create({
                data: {
                    product_name: product_deatils.product_name,
                    product_description: product_deatils.product_description,
                    price: Number(product_deatils.price),
                    quantity: Number(product_deatils.qunatity),
                }
            });

            await tx.product_images.createMany({
                data: passed.map(item => ({
                    product_id: product.id,
                    image_url: item.url,
                }))
            });


            return product;

        }, { timeout: 20000, maxWait: 10000 });

        console.log("03")

        return res.status(200).json({
            message: "Product and images uploaded successfully",
            productId: response.id,
            valid: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

productsRouter.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const products = await prisma.products.findMany({});
        if (!products || products.length == 0) {
            res.status(404).json({
                message: "No products to display",
                valid: false
            })
            return
        }
        const ids = products.map(product => {
            return product.id
        })

        const product_images = await prisma.product_images.findMany({
            where: {
                product_id: {
                    in: ids
                }
            }
        })
        let products_final = products.map((product) => {
            let obj: any = { ...product };
            product_images.map((image) => {
                if (image.product_id == product.id) {
                    if (obj["images"]) {
                        obj.images = [...obj.images, image]
                    } else {
                        obj["images"] = [image]
                    }
                }
            })
            return obj;
        })
        res.status(200).json({
            products: products_final,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})
export default productsRouter;