import type React from "react";
import useAdminOrder from "../hooks/useAdminOrder";
import { LoaderCircle, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
// import { useState } from "react";

const AdminOrders: React.FC = () => {
    const { orders, loading, error } = useAdminOrder();
    // const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    // const [selectedOrder, setSelectedOrder] = useState<string>("");
    if (loading) {
        return <div className="flex items-center justify-center">
            <LoaderCircle />
        </div>
    }
    if (error) {
        return <div>
            {
                toast.error(error)
            }
        </div>
    }
    if (!orders) {
        return <div>
            {
                toast.error(error)
            }
        </div>
    }
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
                            {/* <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th> */}
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
                                            {order.user.first_name.charAt(0)}
                                        </div>
                                        <span className="text-slate-700">{order.user.first_name} {order.user.last_name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{order.ordered_product.length}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">{order.ordered_product.reduce((sum, b) => sum + b.price * b.qunatity, 0)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'Payment Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status == 'Payment Succesfull' ? 'bg-green-200 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
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

    )
}

export default AdminOrders;