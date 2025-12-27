

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const addToCart = async (product_id: string, qunatity: number, price: number) => {
    let error: string = "";
    let message: string = "";
    try {
        const token = localStorage.getItem('token') as string
        const response = await fetch(`${BACKEND_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify({
                product_id: product_id,
                quantity: qunatity,
                price: price
            })
        })
        const data = await response.json();
        if (!data || !data.valid) {
            error = data.message || 'Unable to add to cart';
        } else {
            message = data.message;
        }
    } catch (error) {
        error = "Something went wrong";
    }
    return { message, error }
}

export default addToCart;