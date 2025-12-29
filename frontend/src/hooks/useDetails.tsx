import { useEffect, useState } from "react"
import toast from "react-hot-toast";
type ProductImage = {
    id: string;
    product_id: string;
    image_url: string;
};

type Product = {
    id: string;
    product_name: string;
    product_description: string;
    images: ProductImage[];
    qunatity: number;
    price: number;
};
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useDetails = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') as string
            fetch(`${BACKEND_URL}/user/checkout/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            }).then(async (response: Response) => {
                const data = await response.json()
                if (!data.valid) {
                    toast.error(data.message)
                    setLoading(false);
                    setError(data.message)
                } else {
                    setProducts(data.products)
                    setLoading(false);
                }
            })
        } catch (error) {
            setError("Something went wrong")
            setLoading(false);
        }
    }, [])
    return { products, error, loading }
}
export default useDetails;