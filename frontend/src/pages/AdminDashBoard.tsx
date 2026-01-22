import type React from "react";
import { useState } from "react";
// import AdminOrders from "../components/AdminOrder";
import {
    Home,
    ShoppingCart,
    Package,
    CreditCard,
    Users,
    Activity,
    Search,
    Bell,
    LogOut,
} from 'lucide-react';
import AdminProducts from "../components/AdminProducts";
import AdminHomeTab from "../components/AdminHomeTab";
import AdminOrders from "../components/AdminOrder";
import AdminPayment from "../components/AdminPayments";
import { useNavigate } from "react-router-dom";
type Tabs = "Home" | "Orders" | "Products" | "Payments" | "Users"
const AdminDashBoard: React.FC = () => {

    const [currentTab, setCurrentTab] = useState<Tabs>("Home");

    const tabsConfig = [
        { name: "Home", icon: Home, color: "from-violet-500 to-purple-500" },
        { name: "Orders", icon: ShoppingCart, color: "from-blue-500 to-cyan-500" },
        { name: "Products", icon: Package, color: "from-emerald-500 to-teal-500" },
        { name: "Payments", icon: CreditCard, color: "from-orange-500 to-amber-500" },
        { name: "Users", icon: Users, color: "from-pink-500 to-rose-500" }
    ];
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Sidebar */}
            <div className="w-72 bg-white shadow-xl flex flex-col border-r border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                            <p className="text-xs text-slate-500">Dashboard v2.0</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {tabsConfig.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.name;
                        return (
                            <button
                                key={tab.name}
                                onClick={() => setCurrentTab(tab.name as Tabs)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{tab.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            A
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">Admin User</p>
                            <p className="text-xs text-slate-500">admin@store.com</p>
                        </div>
                        <LogOut onClick={() => {
                            navigate('/admin/signin')
                            localStorage.clear()
                        }} className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{currentTab}</h1>
                        <p className="text-sm text-slate-500">Manage your {currentTab.toLowerCase()} efficiently</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                            <Bell className="w-6 h-6 text-slate-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-8">
                    {currentTab === "Home" && <AdminHomeTab />}
                    {currentTab === "Orders" && <AdminOrders />}
                    {currentTab === "Products" && <AdminProducts />}
                    {currentTab === "Payments" && <AdminPayment />}
                    {currentTab === "Users" && <>Users</>}
                </div>
            </div>
        </div>
    );
}






export default AdminDashBoard;