import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface Product {
    id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
    images: ProductImage[];
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useProductSearch = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setloading] = useState<boolean>(false)
    const path = useLocation()

    useEffect(() => {
        const word = path.pathname.split('/').at(-1) as string
        try {
            setloading(true)

            fetch(`${BACKEND_URL}/product/getProduct/${word}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(async (res: Response) => {
                const data = await res.json()
                if (!data.valid) {
                    setProducts([])
                    setloading(false)
                } else {
                    setProducts(data.products)
                    setloading(false)
                }
            })
        } catch (error) {
            setProducts([])
            setloading(false)
        }
    }, [])
    return { products, loading }
}

export default useProductSearch;