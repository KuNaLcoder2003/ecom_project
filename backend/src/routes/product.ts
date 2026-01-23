import express from "express";
const productsRouter = express.Router();
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { post_product, } from "@kunaljprsingh/ecom-types";
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

interface Product_Variant {
    price: number,
    quantity: number,
    color: string,
    size: string
}
interface Product_Variant_Response {
    id: string,
    product_id: string,
    price: number,
    quantity: number,
    color: string,
    size: string
}

interface Product {
    product_name: string;
    product_description: string;
    variants: Product_Variant[] | any
    category?: string

}
interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface Product_Type {
    id: string;
    product_name: string;
    product_description: string;
    images: ProductImage[];
}

productsRouter.post('/', upload.array('images'), async (req: express.Request, res: express.Response) => {
    try {
        const { product_description, product_name, variants, category }: Product = req.body;
        console.log(req.body)
        const images = req.files as Express.Multer.File[]

        let buffer: Buffer[] = [];
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
                    product_name: product_name,
                    product_description: product_description,
                    category: category
                }
            });

            await tx.product_images.createMany({
                data: passed.map(item => ({
                    product_id: product.id,
                    image_url: item.url,
                }))
            });

            let jsonArray = variants.map((str: any) => {
                // Standardize the string so it's valid JSON:
                // This regex wraps keys and non-numeric values in double quotes
                let formattedStr = str
                    .replace(/([a-zA-Z0-9]+)\s*:/g, '"$1":')  // Wrap keys in quotes
                    .replace(/:\s*([a-zA-Z]+)/g, ': "$1"');   // Wrap string values in quotes

                // return JSON.parse(formattedStr);
            });

            console.log(jsonArray)

            const records = await Promise.all(jsonArray.map(async (item: Product_Variant) => {
                const new_variant = await tx.product_variants.create({
                    data: {
                        price: Number(item.price),
                        quantity: Number(item.quantity),
                        color: item.color,
                        size: item.size,
                        product_id: product.id
                    }
                })
                return new_variant;
            }))

            if (!records || records.length == 0) {
                throw new Error("Unable to add products")
            }


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

        const response = await prisma.$transaction(async (tx) => {
            const products = await tx.product_variants.findMany({
                select: {
                    size: true,
                    product: true,
                    id: true,
                    price: true,
                    quantity: true,
                    color: true,
                }
            });
            if (!products || products.length == 0) {
                throw new Error("No products to display")

            }
            const ids = products.map(product => {
                return product.product.id
            })

            const product_images = await tx.product_images.findMany({
                where: {
                    product_id: {
                        in: ids
                    }
                }
            })
            const products_final = products.map((product) => {
                let obj: any = { ...product };
                product_images.map((image) => {
                    if (image.product_id == product.product.id) {
                        if (obj["images"]) {
                            obj.images = [...obj.images, image]
                        } else {
                            obj["images"] = [image]
                        }
                    }
                })
                return obj;
            })
            return { products_final }

        }, { timeout: 20000, maxWait: 10000 })

        res.status(200).json({
            products: response.products_final,
            valid: true
        })
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Something went wrong",
            valid: false
        })
    }
})

productsRouter.get('/:productId', async (req: express.Request, res: express.Response) => {
    try {
        const productId = req.params.productId;
        if (!productId) {
            res.status(400).json({
                message: "Bad request",
                valid: false
            })
            return
        }
        const product = await prisma.products.findUnique({
            where: {
                id: productId
            }
        })
        if (!product) {
            res.status(404).json({
                message: "Product Not Found",
                valid: false
            })
            return
        }
        const productImages = await prisma.product_images.findMany({
            where: {
                product_id: product.id
            }
        })
        const product_vairants = await prisma.product_variants.findMany({
            where: {
                product_id: product.id
            }
        })
        const sizes = product_vairants.map(item => {
            return item.size
        })
        const colors = [...new Set(product_vairants.map(({ color }) => color))];

        res.status(200).json({
            valid: true,
            product: {
                ...product,
                images: productImages,
                sizes: sizes,
                colors: colors,
                variants: product_vairants
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

productsRouter.get('/getProduct/:keyword', async (req: express.Request, res: express.Response) => {
    try {
        const word = req.params.keyword;
        const response = await prisma.$transaction(async (tx) => {
            const products = await tx.products.findMany({
                where: {
                    product_name: {
                        startsWith: word
                    }
                }
            })
            return { products }
        }, { timeout: 20000, maxWait: 10000 })

        if (!response || !response.products) {
            res.status(403).json({
                message: 'Unable to fetch the products at the moment',
                valid: false,
            })
            return
        }
        const ids = response.products.map(item => {
            return item.id
        })

        const product_images = await prisma.product_images.findMany({
            where: {
                product_id: {
                    in: ids
                }
            }
        })

        if (!product_images) {
            res.status(403).json({
                message: 'Unable to fetch the products at the moment',
                valid: false,
            })
            return
        }

        const products = response.products.map(item => {
            let temp: Product_Type = { ...item, images: [] }
            product_images.map(obj => {
                if (obj.product_id == item.id) {
                    temp.images = [...temp.images, obj]
                }
            })
            return temp;
        })

        res.status(200).json({
            products: products,
            valid: true
        })

    } catch (error) {
        res.status(500).json({
            error: error,
            message: "Something went wrong",
            valid: false
        })
    }
})
export default productsRouter;