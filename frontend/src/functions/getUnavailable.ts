import type { NavigateFunction } from "react-router-dom";

interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}
interface Cart {
    cart_id: string;
    product_id: string;
    qunatity: number;
    price: number;
    images: ProductImage[]
}
interface Response {
    product_id: string,
    err: string
}
interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface Product {
    id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
    images: ProductImage[];
}
// interface unavailableProduct {
//     id: string;
//     product_name: string;
//     product_description: string;
//     price: number;
//     quantity: number;
//     images: ProductImage[];
//     error: string
// }
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const getUnavailable = async (cart: Cart[], navigate: NavigateFunction) => {
    try {
        const token = localStorage.getItem('token') as string
        const response = await fetch(`${BACKEND_URL}/cart/checkout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                cart: cart
            })
        })
        const data = await response.json();
        if (data.valid) {
            navigate("/order")
            return null
        }
        if (!data.valid && data.unavailable) {
            return data.unavailable as Response[]
        }
        else {
            return null
        }
    } catch (error) {
        return null
    }
}

export const getProducts = async (productIds: string[]) => {
    try {

        const products = await Promise.all(
            productIds.map(async (id) => {
                const response = await fetch(`${BACKEND_URL}/product/${id}`);

                if (!response.ok) return null;

                return response.json();
            })
        );
        const fulfilled = products.filter(
            (product): product is Product => product !== null
        );
        return fulfilled
    } catch (error) {
        return []
    }
}

export default getUnavailable;