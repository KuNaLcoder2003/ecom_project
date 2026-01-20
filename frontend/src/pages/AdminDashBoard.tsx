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
    Settings,
    DollarSign,
    MoreVertical,
    TrendingUp,
    Calendar
} from 'lucide-react';
import AdminProducts from "../components/AdminProducts";
import AdminHomeTab from "../components/AdminHomeTab";
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
                        <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
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
                    {currentTab === "Orders" && <OrdersTab />}
                    {currentTab === "Products" && <AdminProducts />}
                    {currentTab === "Payments" && <PaymentsTab />}
                    {currentTab === "Users" && <>Users</>}
                </div>
            </div>
        </div>
    );
}



const PaymentsTab: React.FC = () => {
    const payments = [
        { id: "PAY-001", order: "#ORD-1234", customer: "Rahul Sharma", amount: "₹4,599", method: "UPI", status: "Success", date: "Jan 18, 2026" },
        { id: "PAY-002", order: "#ORD-1235", customer: "Priya Patel", amount: "₹1,899", method: "Card", status: "Success", date: "Jan 19, 2026" },
        { id: "PAY-003", order: "#ORD-1236", customer: "Amit Kumar", amount: "₹7,299", method: "Net Banking", status: "Pending", date: "Jan 20, 2026" },
        { id: "PAY-004", order: "#ORD-1237", customer: "Sneha Reddy", amount: "₹2,999", method: "Wallet", status: "Failed", date: "Jan 20, 2026" }
    ];

    return (
        <div className="space-y-6">
            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                    <DollarSign className="w-10 h-10 mb-4 opacity-80" />
                    <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold">₹16,796</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                    <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                    <p className="text-sm opacity-90 mb-1">Successful Payments</p>
                    <p className="text-3xl font-bold">2</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                    <Calendar className="w-10 h-10 mb-4 opacity-80" />
                    <p className="text-sm opacity-90 mb-1">Pending Payments</p>
                    <p className="text-3xl font-bold">1</p>
                </div>
            </div>

            {/* Payment Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Payment History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Payment ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Order</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {payments.map((payment, index) => (
                                <tr key={index} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-semibold text-slate-800">{payment.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{payment.order}</td>
                                    <td className="px-6 py-4 text-slate-700">{payment.customer}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">{payment.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.status === 'Success' ? 'bg-green-100 text-green-700' :
                                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{payment.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const OrdersTab: React.FC = () => {
    const orders = [
        { id: "#ORD-1234", customer: "Rahul Sharma", items: 3, total: "₹4,599", status: "Delivered", date: "Jan 18, 2026" },
        { id: "#ORD-1235", customer: "Priya Patel", items: 1, total: "₹1,899", status: "Processing", date: "Jan 19, 2026" },
        { id: "#ORD-1236", customer: "Amit Kumar", items: 5, total: "₹7,299", status: "Shipped", date: "Jan 20, 2026" },
        { id: "#ORD-1237", customer: "Sneha Reddy", items: 2, total: "₹2,999", status: "Pending", date: "Jan 20, 2026" }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">All Orders</h2>
                        <p className="text-sm text-slate-500 mt-1">Manage and track all customer orders</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
                        Export Orders
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {orders.map((order, index) => (
                            <tr key={index} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-semibold text-slate-800">{order.id}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                                            {order.customer.charAt(0)}
                                        </div>
                                        <span className="text-slate-700">{order.customer}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{order.items}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{order.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-orange-100 text-orange-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                                        <MoreVertical className="w-5 h-5 text-slate-600" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashBoard;