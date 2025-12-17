import { type Sign_Up } from "@kunaljprsingh/ecom-types";
interface SignUpReturn {
    token: string | null,
    message: string
}
const signup = async (userDetails: Sign_Up): Promise<SignUpReturn> => {
    const SIGNUP_URL = `${import.meta.env.VITE_BACKEND_URL}/user/signup`;
    try {

        const response = await fetch(SIGNUP_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDetails)
        })

        const data = await response.json();
        if (!data.valid || !data.token) {
            return {
                token: null,
                message: data.message,
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
            message: "Somethig went wrong"
        }
    }
}

export default signup;