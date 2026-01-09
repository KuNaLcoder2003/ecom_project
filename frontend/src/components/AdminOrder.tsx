import type React from "react";
import useAdminOrder from "../hooks/useAdminOrder";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

const AdminOrders: React.FC = () => {
    const { orders, loading, error, loading_detail, ordered_products, getOrderdProduct } = useAdminOrder();
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

                        <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-lg font-semibold whitespace-nowrap">
                                Order Id:
                            </h3>
                            <p className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]">
                                {item.id}
                            </p>
                        </div>


                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <h3 className="text-lg font-semibold">Status:</h3>
                            <p>{item.status ? "Completed" : "Pending or Cancelled"}</p>
                        </div>


                        <button onClick={() => {
                            setSelectedOrder(item.id)
                            setIsDetailsOpen(true)
                            getOrderdProduct(item.id)
                        }
                        } className="text-md text-white px-6 py-2 bg-black rounded-lg whitespace-nowrap cursor-pointer">
                            View Details
                        </button>

                    </div>
                    {
                        (isDetailsOpen && selectedOrder == item.id) ?

                            loading_detail ? < div className="flex items-center justify-between border-b py-4 animate-pulse">
                                <div className="flex items-center gap-4 w-full">

                                    <div className="w-16 h-16 bg-gray-200 rounded" />


                                    <div className="w-1/3 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-full" />
                                    </div>


                                    <div className="w-32 h-4 bg-gray-200 rounded" />


                                    <div className="w-24 h-4 bg-gray-200 rounded" />
                                </div>


                                <div className="ml-4 w-28 h-9 bg-gray-200 rounded" />
                            </div > : ordered_products && ordered_products?.length > 0 ?
                                <div className="flex flex-col items-center m-auto py-4 gap-4">

                                    {
                                        ordered_products.map(item => {
                                            return (
                                                <div className="flex items-center gap-4 w-full">

                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.product.product_name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />


                                                    <div className="w-1/3">
                                                        <p className="font-medium">{item.product.product_name}</p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">
                                                            {item.product.product_description}
                                                        </p>
                                                    </div>


                                                    <div className="w-32 font-semibold text-green-600">
                                                        ₹{item.price}
                                                    </div>


                                                    <div className="w-24 text-gray-600">
                                                        Qty: {item.qunatity}
                                                    </div>
                                                    <div className="w-30 text-gray-600">
                                                        Total : {item.qunatity * item.price}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }


                                </div>
                                :
                                <p>No Products to show</p>
                            : null
                    }
                </>

            ))
            }
        </div >

    )
}

export default AdminOrders;