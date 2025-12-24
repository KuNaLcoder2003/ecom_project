import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token || token.length == 0) {
            setIsLoggedIn(false)
        } else {
            setIsLoggedIn(true)
        }
    }, [])

    const onLogin = () => {
        setIsLoggedIn(true);
    }
    const onLogout = () => {
        setIsLoggedIn(false);
        localStorage.clear();
        navigate("/signin")
    }

    return { isLoggedIn, onLogin, onLogout }
}

export default useAuth;