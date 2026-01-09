import { useEffect, useState } from "react";
export interface OrderItem {
    product: Product;
    order: Order;
    qunatity: number; // typo preserved from API
}

export interface Product {
    id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    cart_id: string;
    address_id: string;
    status: boolean;
}

interface Orders {
    id: string;
    status: boolean;
    user_id: string;
    cart_id: string;
    address_id: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function useAdminOrder() {
    const [orders, setOrders] = useState<Orders[]>();
    // const [ordered_products, setOrderdProducts] = useState<OrderItem[]>()
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token') as string;
            fetch(`${BACKEND_URL}/order/getAllOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(async (res: Response) => {
                const data = await res.json();
                if (!data.valid) {
                    setLoading(false)
                    setError(error);
                } else {
                    setLoading(false)
                    setOrders(data.order);
                }
            })
        } catch (error) {
            setLoading(false)
            setError(`${error}`)
        }
    }, [])
    return { orders, error, loading }
}
export default useAdminOrder;