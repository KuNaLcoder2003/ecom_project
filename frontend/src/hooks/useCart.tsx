import { useEffect, useState } from "react";
import getUnavailable from "../functions/getUnavailable";
import toast from "react-hot-toast";
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
    images: ProductImage[],
    err?: string
}
interface Response_Unavailable {
    product_id: string,
    err: string
}
const useCart = () => {
    const [cart, setCart] = useState<Cart[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loading_unavailable, setLoadingUnavailable] = useState<boolean>(false);
    const [route, setRoute] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [unavailble, setUnavailable] = useState<Response_Unavailable[]>();
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

    const handleCheckout = async (cart: Cart[]) => {
        setLoadingUnavailable(true);
        try {
            const unavailble = await getUnavailable(cart)
            if (!unavailble || unavailble == null) {
                setUnavailable([]);
                toast.error("Unable to checkout");
                setRoute(false);
            } else if (unavailble.length == 0) {
                setUnavailable([]);
                toast.error("Unable to checkout");
                setRoute(false);
            } else {
                setUnavailable(unavailble);
                const updated_cart = cart.map(item => {
                    let temp = { ...item }
                    unavailble.map(obj => {
                        if (obj.product_id == item.product_id) {
                            temp.err = obj.err
                        }
                    })
                    return temp
                })
                setCart(updated_cart)
                setRoute(true);
            }
        } catch (error) {
            setUnavailable([]);
            toast.error("Unable to checkout");
            setRoute(false);
        }
    }
    return { cart, loading, error, unavailble, route, handleCheckout, loading_unavailable }

}

export default useCart;