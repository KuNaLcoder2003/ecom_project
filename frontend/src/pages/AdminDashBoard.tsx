import type React from "react";
import { useState } from "react";
import AdminOrders from "../components/AdminOrder";
import AdminProducts from "../components/AdminProducts";
type Tabs = "Home" | "Orders" | "Products" | "Payments" | "Users"
const AdminDashBoard: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<Tabs>("Home");

    const Tabs: Tabs[] = ["Home", "Orders", "Products", "Users", "Payments"]
    return (
        <div className="w-full h-full flex">
            <div className="w-64 h-screen bg-gray-100 flex flex-col items-center gap-4">
                <div className="">
                    <h2 className="text-xl font-semibold text-center mb-8 mt-6">Admin Dashboard</h2>
                </div>
                {
                    Tabs.map(tab => {
                        return (
                            <p onClick={() => setCurrentTab(tab)} className={`text-lg font-medium cursor-pointer p-2 px-6 rounded-lg ${currentTab == tab ? "bg-black text-white" : ""}`}>{tab}</p>
                        )
                    })
                }
            </div>
            <div className="flex-1 p-6">
                {
                    currentTab == "Home" && <h1 className="text-2xl font-bold">Main Content</h1>
                }
                {
                    currentTab == "Payments" && <h1 className="text-2xl font-bold">Payments</h1>
                }
                {
                    currentTab == "Products" &&
                    <>
                        <h1 className="text-2xl font-bold">Products</h1>
                        <AdminProducts />
                    </>
                }

                {
                    currentTab == "Users" && <h1 className="text-2xl font-bold">Users</h1>
                }

                {
                    currentTab == "Orders" && <>
                        <h1 className="text-2xl font-bold">Orders</h1>
                        <AdminOrders />
                    </>
                }
            </div>
        </div>
    )
}

export default AdminDashBoard;