
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom";

interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}
interface Product_Variant_Response {
    id: string,
    product_id: string,
    price: number,
    quantity: number,
    color: string,
    size: string
}

interface Product {
    id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
    images: ProductImage[];
    variants: Product_Variant_Response[];
    colors: string[]
    sizes: string[]
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useProduct = () => {
    const path = useLocation();
    const [product, setProduct] = useState<Product | null>(null)
    const [error, setError] = useState<string>("")
    const [valid, setValid] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [colors, setColors] = useState<string[]>([])
    const [sizes, setSizes] = useState<string[]>([])
    const [varinats, setVariants] = useState<Product_Variant_Response[]>([])
    useEffect(() => {
        setLoading(true)
        const id = path.pathname.split('/').at(-1);
        console.log(id);
        try {
            fetch(`${BACKEND_URL}/product/${id}`, {
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
                    setProduct(data.product);
                    setLoading(false);
                    setColors(data.product.colors)
                    setSizes(data.product.sizes)
                    setVariants(data.product.variants)
                }
            })
        } catch (error) {
            setError("Something went wrong")
            setLoading(false)
        }
    }, [])
    return { product, error, valid, loading, colors, sizes, varinats }
}

export default useProduct;