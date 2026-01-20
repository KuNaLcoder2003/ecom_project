import { useEffect, useState } from "react"

interface OrderDetails {
    user_name: string;
    status: boolean;
    amount: number | undefined;
    order_id: string
}
const useAdmin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<number>(0);
    const [payments, setPayments] = useState<number>(0)
    const [products, setProducts] = useState<number>(0)
    const [productVarinats, setProductVarinats] = useState<number>(0)
    const [users, setUsers] = useState<number>(0)
    const [order_details, setOrderDetails] = useState<OrderDetails[]>([])
    const [error, setError] = useState<string | null>(null)
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        try {
            setLoading(true)
            fetch(`${BACKEND_URL}/user/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (response: Response) => {
                const data = await response.json();
                if (!data.valid) {
                    setError(data.message)
                    setLoading(false)
                } else {
                    setOrderDetails(data.order_details)
                    setOrders(data.orders)
                    setPayments(data.payment)
                    setProductVarinats(data.product_variants)
                    setProducts(data.products)
                    setUsers(data.users)
                    setLoading(false)
                }
            })
        } catch (error) {
            setLoading(false)
            setError("Something went wrong")
        }
    }, [])

    return { loading, orders, products, payments, productVarinats, users, order_details, error }
}

export default useAdmin;