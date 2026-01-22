import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface payments {
    id: string;
    order_id: string;
    amount: number;
    completed: boolean;
    created_at: Date;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        gender: string;
        age: string;
    };
}

const useAdminPayment = () => {
    const [payments, setPaymemts] = useState<payments[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    useEffect(() => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token') as string
            if (!token) {
                return
            }
            fetch(`${BACKEND_URL}/user/admin/payments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            }).then(async (response: Response) => {
                const data = await response.json()
                if (!data || !data.valid) {
                    setError(data.message)
                    setLoading(false)
                } else {
                    setPaymemts(data.payments)
                    setLoading(false)
                }
            })
        } catch (error) {
            setError("Something went wrong")
            setLoading(false)
        }
    }, [])
    return { loading, payments, error }
}

export default useAdminPayment;