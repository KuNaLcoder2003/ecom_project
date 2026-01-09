import type React from "react";
import useAdminOrder from "../hooks/useAdminOrder";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const AdminOrders: React.FC = () => {
    const { orders, loading, error } = useAdminOrder();
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<string>("");
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
        <div className="w-full mt-4 mb-4 flex flex-col items-baseline gap-4">
            {orders.map((item) => (
                <>
                    <div
                        key={item.id}
                        className="w-full p-2 flex flex-nowrap items-center justify-between gap-6 border-b"
                    >
                        {/* Order ID */}
                        <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-lg font-semibold whitespace-nowrap">
                                Order Id:
                            </h3>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                                {item.id}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <h3 className="text-lg font-semibold">Status:</h3>
                            <p>{item.status ? "Completed" : "Pending or Cancelled"}</p>
                        </div>

                        {/* Button */}
                        <button onClick={() => {
                            setIsDetailsOpen(true)
                            setSelectedOrder(item.id)
                        }
                        } className="text-md text-white px-6 py-2 bg-black rounded-lg whitespace-nowrap cursor-pointer">
                            View Details
                        </button>

                    </div>
                    {
                        (isDetailsOpen && selectedOrder == item.id) ?
                            <div>
                                {item.id}
                            </div> : null
                    }
                </>

            ))}
        </div>

    )
}

export default AdminOrders;