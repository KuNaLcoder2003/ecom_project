import { useEffect, useState } from "react"

const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

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
    }

    return { isLoggedIn, onLogin, onLogout }
}

export default useAuth;