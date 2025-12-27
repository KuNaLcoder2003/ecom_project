import { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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
const useCart = () => {
    const [cart, setCart] = useState<Cart[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('token')
        try {
            fetch(`${BACKEND_URL}/cart/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token as string
                }
            }).then(async (res: Response) => {
                const data = await res.json();
                if (!data.valid || !data) {
                    setLoading(false)
                    setError(data.message)
                } else {
                    setLoading(false)
                    setCart(data.cart)
                }
            })
        } catch (error) {
            setLoading(false)
            setError("Something went wrong")
        }
    }, [])
    return { cart, loading, error }
}

export default useCart;