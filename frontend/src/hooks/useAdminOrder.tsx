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
interface MergedItem {
    images: string[];
    price: number;
    qunatity: number; // keeping typo as-is to match backend
    product: Product;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function useAdminOrder() {
    const [orders, setOrders] = useState<Orders[]>();
    const [ordered_products, setOrderdProducts] = useState<MergedItem[]>()
    const [loading, setLoading] = useState<boolean>(false);
    const [loading_detail, setLoadingDetail] = useState<boolean>(false);
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

    async function getOrderdProduct(order_id: string) {
        try {
            setLoadingDetail(true)
            const token = localStorage.getItem('token') as string
            const reponse = await fetch(`${BACKEND_URL}/order/getOrderDetails/${order_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            const data = await reponse.json();
            if (data.valid) {
                setOrderdProducts(data.ordered_products);
                setLoadingDetail(false)
            } else {
                setLoadingDetail(false)
            }
        } catch (error) {
            setLoadingDetail(false)
        }
    }
    return { orders, error, loading, ordered_products, getOrderdProduct, loading_detail }
}
export default useAdminOrder;