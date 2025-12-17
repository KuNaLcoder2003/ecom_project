import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { sign_in, sign_up, type Sign_In, type Sign_Up } from "@kunaljprsingh/ecom-types"
import getToken from "../function/generateToken.js";
const userRouter = express.Router();
import dotenv from "dotenv"
dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({
    adapter
});

userRouter.post("/signup", async (req: express.Request, res: express.Response) => {
    try {
        const signup: Sign_Up = req.body;
        const { success } = sign_up.safeParse(signup)
        if (!success) {
            res.status(403).json({
                message: "Inavlid Types",
                valid: false
            })
            return
        }
        const user = await prisma.users.findFirst({
            where: {
                email: signup.email
            }
        })
        if (user) {
            res.status(402).json({
                message: "User already exsist , try Login",
                valid: false
            })
            return
        }
        const response = await prisma.$transaction(async (tx) => {
            const new_user = await tx.users.create({
                data: {
                    email: signup.email,
                    first_name: signup.first_name,
                    last_name: signup.last_name,
                    password: signup.password,
                    age: signup.age,
                    gender: signup.gender
                }
            })
            const new_address = await tx.address.create({
                data: {
                    user_id: new_user.id,
                    street: signup.street,
                    house_no: signup.house_no,
                    city: signup.city,
                    state: signup.state,
                    pin_code: signup.pincode,
                    land_mark: signup.land_mark
                }
            })
            return { new_user, new_address }
        }, { timeout: 20000, maxWait: 10000 })
        if (!response.new_address || !response.new_user) {
            res.status(403).json({
                message: "Unable to create account",
                valid: false,
            })
            return
        }
        const token = getToken(response.new_user.email, response.new_user.id);
        if (!token) {
            res.status(403).json({
                message: "Error signup",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Account created",
            valid: true,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

userRouter.post("/signin", async (req: express.Request, res: express.Response) => {
    try {
        const credentials: Sign_In = req.body;
        const { success } = sign_in.safeParse(credentials)
        if (!success) {
            res.status(403).json({
                message: "Invalid Credentials types",
                valid: false
            })
            return
        }

        const user = await prisma.users.findFirst({
            where: {
                email: credentials.email
            }
        })
        if (!user) {
            res.status(404).json({
                message: "User not found",
                valid: false
            })
            return
        }

        const token = getToken(user.email, user.id)
        if (!token) {
            res.status(403).json({
                message: "Unable to login",
                valid: false
            })
            return
        }
        res.status(200).json({
            message: "Successfully LoggedIn",
            valid: true,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            valid: false
        })
    }
})

export default userRouter;