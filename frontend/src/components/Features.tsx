import { Ribbon, SubscriptIcon, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type React from "react";

const Features: React.FC = () => {
    const features = [
        {
            id: 1,
            heading: "Free Shipping",
            content: "Upgrade your style today and get FREE shipping on all orders! Don't miss out.",
            icon: <Truck />
        },
        {
            id: 2,
            heading: "Satisfaction Gaurantee",
            content: "Shop confidently with our Satisfaction Guarantee: Love it or get a refund.",
            icon: <Ribbon />
        },
        {
            id: 3,
            heading: "Secure Payment",
            content: "Your security is our priority. Your payments are secure with us.",
            icon: <SubscriptIcon />
        }
    ]
    return (
        <div className="max-w-7xl p-4 m-auto mt-10">
            <div className="flex items-center justify-around">
                {
                    features.map(feature => {
                        return (
                            <Card {...feature} />
                        )
                    })
                }
            </div>
        </div>
    )
}

interface CardProp {
    icon: ReactNode,
    heading: string,
    content: string
}

const Card: React.FC<CardProp> = ({ icon, heading, content }) => {
    return (
        <div className="space-y-4">
            <div className="w-[50px] h-[50px] bg-stone-100 rounded-full flex items-center justify-center">{icon}</div>
            <div className="flex flex-col items-baseline gap-2">
                <h2 className="font-semibold">{heading}</h2>
                <p className="text-sm w-[300px]">{content}</p>
            </div>
        </div>
    )
}

export default Features;