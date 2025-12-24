import express from "express"
import jwt from "jsonwebtoken"
const secret = process.env.jwt_secret as string;
interface jwtverified {
    email: string,
    id: string
}
function authMiddleware(req: any, res: express.Response, next: express.NextFunction) {
    try {
        const authToken = req.headers.authorization;
        if (!authToken || !authToken.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }
        const token = authToken.split('Bearer ').at(-1) as string;
        const verified = jwt.verify(token, secret) as jwtverified;
        if (!verified) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }
        else {
            req.userId = verified.id;
            req.userEmail = verified.email;
            next();
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
}

export default authMiddleware;