
import { useEffect, useState } from "react"


interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface Product_Type {
    id: string;
    product_name: string;
    product_description: string;
}

interface Product {
    id: string;
    color: string;
    size: string
    product: Product_Type
    price: number;
    quantity: number;
    images: ProductImage[];
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useProducts = () => {

    const [products, setProducts] = useState<Product[] | null>(null)
    const [error, setError] = useState<string>("")
    const [valid, setValid] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {

        try {
            setLoading(true)
            fetch(`${BACKEND_URL}/product`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (response: Response) => {
                const data = await response.json()
                setValid(data.valid);
                if (!data || !data.valid) {
                    setError(data.message);
                    setLoading(false)
                } else {
                    setProducts(data.products);
                    setLoading(false)
                }
            })
        } catch (error) {
            setError("Something went wrong")
            setLoading(false)
        }
    }, [])
    return { products, error, valid, loading }
}

export default useProducts;