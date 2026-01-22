import type React from "react"
import useAdminPayment from "../hooks/useAdminPayment"
import { Calendar, DollarSign, Loader, TrendingUp } from "lucide-react"

const AdminPayment: React.FC = () => {
    const { payments, error, loading } = useAdminPayment()

    if (error) {
        <div className="w-full h-full flex items-center justify-center">
            {
                error
            }
        </div>
    }
    return (
        <>
            {
                loading ?
                    <Loader />
                    : payments.length > 0 ? <div className="space-y-6">
                        {/* Payment Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                                <DollarSign className="w-10 h-10 mb-4 opacity-80" />
                                <p className="text-sm opacity-90 mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold">₹{payments.reduce((sum, b) => sum + b.amount, 0)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
                                <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
                                <p className="text-sm opacity-90 mb-1">Successful Payments</p>
                                <p className="text-3xl font-bold">{payments.filter(item => item.completed == true).length}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
                                <Calendar className="w-10 h-10 mb-4 opacity-80" />
                                <p className="text-sm opacity-90 mb-1">Pending Payments</p>
                                <p className="text-3xl font-bold">{payments.filter(item => item.completed == false).length}</p>
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
                                                <td className="px-6 py-4 text-slate-600">{payment.order_id}</td>
                                                <td className="px-6 py-4 text-slate-700">{payment.user.first_name} {payment.user.last_name}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-800">${payment.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                                        {"Card"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${payment.completed ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                        }`}>
                                                        {payment.completed ? "Completed" : "Pending"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{payment.created_at.toString().split('T')[0]} </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> : null
            }
        </>
    )
}

export default AdminPayment;