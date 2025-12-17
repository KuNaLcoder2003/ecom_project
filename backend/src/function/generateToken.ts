import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const secret = process.env.jwt_secret as string;

const getToken = (email: string, id: string): string => {
    const token = jwt.sign({ email: email, id: id }, secret);
    return token;
}

export default getToken;