import { useEffect, useState } from "react"
import toast from "react-hot-toast";
type Address = {
    id: string;
    house_no: string;
    street: string;
    land_mark: string;
    city: string;
    state: string;
    pin_code: string;
};
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useAddress = () => {
    const [address, setAddress] = useState<Address[]>([]);
    const [error, setError] = useState<string>("")
    useEffect(() => {
        try {
            const token = localStorage.getItem('token') as string
            fetch(`${BACKEND_URL}/user/addresses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            }).then(async (response: Response) => {
                const data = await response.json()
                if (!data.valid) {
                    toast.error(data.message)
                    setError(data.message)
                } else {
                    setAddress(data.addresses)
                }
            })
        } catch (error) {
            setError("Something went wrong")
        }
    }, [])
    return { address, error }
}
export default useAddress;