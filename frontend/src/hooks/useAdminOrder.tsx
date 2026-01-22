import { useEffect, useState } from "react";
interface orders {
    id: string;
    status: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        gender: string;
        age: string;
    };
    ordered_product: {
        product_id: string;
        price: number;
        qunatity: number;
        order_id: string;
    }[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
function useAdminOrder() {
    const [orders, setOrders] = useState<orders[]>();
    // const [ordered_products, setOrderdProducts] = useState<MergedItem[]>()
    const [loading, setLoading] = useState<boolean>(false);
    const [loading_detail, setLoadingDetail] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    useEffect(() => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token') as string;
            fetch(`${BACKEND_URL}/order/admin/orderDetails`, {
                method: 'GET',
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
                    setOrders(data.orders);
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
                // setOrderdProducts(data.ordered_products);
                setLoadingDetail(false)
            } else {
                setLoadingDetail(false)
            }
        } catch (error) {
            setLoadingDetail(false)
        }
    }
    return { orders, error, loading, getOrderdProduct, loading_detail }
}
export default useAdminOrder;