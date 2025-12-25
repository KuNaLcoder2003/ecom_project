import * as z from "zod";
export const sign_up = z.object({
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    password: z.string().min(5),
    gender: z.string(),
    age: z.string(),
    house_no: z.string(),
    street: z.string(),
    land_mark: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string()
})

export const sign_in = z.object({
    email: z.string(),
    password: z.string(),
})

export const post_product = z.object({
    product_name: z.string(),
    product_description: z.string(),
    price: z.int(),
    qunatity: z.int()
})

export const cart = z.object({
    product_id: z.string(),
    quantity: z.number(),
    price: z.number()
})

export const order = z.object({
    user_id: z.string(),
    product_id: z.string(),
})

export type Sign_Up = z.infer<typeof sign_up>
export type Sign_In = z.infer<typeof sign_in>
export type Product = z.infer<typeof post_product>
export type Cart = z.infer<typeof cart>
export type Order = z.infer<typeof order>
