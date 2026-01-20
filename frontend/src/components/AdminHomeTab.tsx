import { ArrowDown, ArrowUp, IndianRupee, LoaderCircle, Package, ShoppingBag, ShoppingCart, UserCheck, Users } from "lucide-react";
import useAdmin from "../hooks/useAdmin";

const AdminHomeTab: React.FC = () => {
    const { orders, order_details, payments, users, loading, productVarinats, products } = useAdmin()
    const stats = [
        { label: "Total Revenue", value: payments ? `₹ ${payments}` : "0", change: "+12.5%", isUp: true, icon: <IndianRupee />, color: "from-green-500 to-emerald-500" },
        { label: "Total Orders", value: `${orders}`, change: "+8.2%", isUp: true, icon: <ShoppingBag />, color: "from-blue-500 to-cyan-500" },
        { label: "Total Products", value: `${products}`, change: "-2.4%", isUp: false, icon: <Package />, color: "from-purple-500 to-violet-500" },
        { label: "Product Variants", value: `${productVarinats}`, change: "5.4%", isUp: false, icon: <Package />, color: "from-purple-500 to-violet-500" },
        { label: "Active Users", value: `${users}`, change: "+15.3%", isUp: true, icon: <UserCheck />, color: "from-pink-500 to-rose-500" }
    ];


    // const recentOrders = [
    //     { id: "#ORD-001", customer: "Rahul Sharma", amount: "₹2,499", status: "Completed", time: "2 mins ago" },
    //     { id: "#ORD-002", customer: "Priya Patel", amount: "₹1,899", status: "Processing", time: "15 mins ago" },
    //     { id: "#ORD-003", customer: "Amit Kumar", amount: "₹3,299", status: "Pending", time: "1 hour ago" },
    //     { id: "#ORD-004", customer: "Sneha Reddy", amount: "₹999", status: "Completed", time: "2 hours ago" }
    // ];

    return (
        <>
            {
                loading ? <div className="w-full h-full flex items-center justify-center">
                    <LoaderCircle />
                </div> : <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => {

                            return (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                                            <div className="w-6 h-6 text-white" >
                                                {stat.icon}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${stat.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {stat.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                            {stat.change}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
                                <button className="text-sm text-violet-600 font-semibold hover:text-violet-700">View All</button>
                            </div>
                            <div className="space-y-3">
                                {order_details.map((order, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                                {order.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{order.user_name}</p>
                                                <p className="text-xs text-slate-500">{order.order_id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">{order.amount}</p>
                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.status ? "Success" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:shadow-lg transition">
                                    <Package className="w-5 h-5" />
                                    <span className="font-semibold">Add Product</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg transition">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span className="font-semibold">View Orders</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg transition">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">Manage Users</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default AdminHomeTab;