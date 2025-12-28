
import { Prisma, PrismaClient } from '@prisma/client';

type DBClient = Prisma.TransactionClient | PrismaClient

export const checkAvailability = async (db: DBClient, product_id: string, requested_qunatity: number) => {
    let err: string = "";
    try {
        const product = await db.products.findUnique({
            where: {
                id: product_id
            }
        })
        if (!product) {
            err = "Product no longer exists"
        }
        else if (product.quantity == 0) {
            err = "Product Out of stock"
        }
        else if (product.quantity < requested_qunatity) {
            err = "Limited Stock available"
        }
    } catch (error) {
        err = "Something went wrong"
    }
    return err;
}

interface Cart_Product {
    product_id: string,
    requested_qunatity: number
}
interface Response {
    product_id: string,
    err: string
}


export const cart_product_availability = async (
    db: DBClient,
    cart_product: Cart_Product[]
): Promise<Response[]> => {
    try {
        const results = await Promise.all(
            cart_product.map(async (product) => {
                const err = await checkAvailability(
                    db,
                    product.product_id,
                    product.requested_qunatity
                );

                if (err.length > 0) {
                    return {
                        product_id: product.product_id,
                        err
                    };
                }

                return null;
            })
        );

        return results.filter(
            (item): item is Response => item !== null
        );
    } catch (error) {
        console.error("Availability check failed:", error);
        return [];
    }
};




