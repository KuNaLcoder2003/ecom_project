import { type Sign_In } from "@kunaljprsingh/ecom-types"
interface SignInReturn {
    token: string | null,
    message: string
}
const signin = async (userCred: Sign_In): Promise<SignInReturn> => {
    const SIGNIN_URL = `${import.meta.env.VITE_BACKEND_URL}/user/signin`;
    try {
        const response = await fetch(SIGNIN_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userCred)
        })
        const data = await response.json();
        if (!data.token || !data.valid) {
            return {
                token: null,
                message: data.message
            }
        } else {
            return {
                token: data.token,
                message: data.message
            }
        }
    } catch (error) {
        return {
            token: null,
            message: "Something went wrong"
        }
    }
}
export default signin;
