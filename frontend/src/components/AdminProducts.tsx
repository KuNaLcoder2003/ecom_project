import type React from "react";
import { useState } from "react";
import useProducts from "../hooks/useProducts";
import toast, { Toaster } from "react-hot-toast";
import { type Product } from "@kunaljprsingh/ecom-types";
import { ImagePlus } from "lucide-react";
type tabs = "Products" | "Add Product"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AdminProducts: React.FC = () => {
    const [tab, setTab] = useState<tabs>("Products")
    const { products, error } = useProducts()

    if (error) {
        toast.error(error)
        return <></>
    }
    if (products?.length == 0) {
        return <p>No product added yet</p>
    }
    return (
        <div className="w-full space-y-4 p-4">
            <Toaster />
            <div className="flex items-center gap-4 w-xl">
                <div onClick={() => setTab("Products")} className={`${tab == "Products" ? "bg-black text-white rounded-lg" : ""} px-6 py-2 text-center cursor-pointer`}>Products</div>
                <div onClick={() => setTab("Add Product")} className={`${tab == "Add Product" ? "bg-black text-white rounded-lg" : ""} px-6 py-2 text-center cursor-pointer`}>Add Product</div>
            </div>

            {
                tab == "Products" && products?.map(product => {
                    return (
                        <ProductRow {...product} key={product.id} />
                    )
                })
            }
            {
                tab == "Add Product" && <AddProduct />
            }
        </div>
    )
}

const AddProduct: React.FC = () => {
    const [productDetails, setProductDetails] = useState<Product>({
        product_name: "",
        product_description: "",
        price: 0,
        qunatity: 0,
    });

    const [images, setImages] = useState<File[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProductDetails((prev) => ({
            ...prev,
            [name]: name === "price" || name === "qunatity" ? Number(value) : value,
        }));
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        if (!e.target.files) return;
        const updatedImages = [...images];
        updatedImages[index] = e.target.files[0];
        setImages(updatedImages);
    };

    const uploadProduct = async () => {

        if (!productDetails.product_name || !productDetails.product_description || !productDetails.price || !productDetails.qunatity) {
            toast.error("Please fill all the feilds")
            return
        }
        if (!images || images.length == 0) {
            toast.error("Please provide atleast one image of the product")
            return
        }

        const formData: FormData = new FormData()
        formData.append('product_description', productDetails.product_description);
        formData.append('product_name', productDetails.product_name);
        formData.append('price', `${productDetails.price}`);
        formData.append('qunatity', `${productDetails.qunatity}`);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        try {
            const response = await fetch(`${BACKEND_URL}/product`, {
                method: 'POST',
                body: formData
            })
            const data = await response.json();
            if (!data.valid) {
                toast.error(data.message)
            } else {
                toast.success(data.message)
            }
            setImages([])
            setProductDetails({
                product_description: "",
                product_name: "",
                price: 0,
                qunatity: 0
            })
        } catch (error) {
            toast.error("Something went wrong")
            setImages([])
            setProductDetails({
                product_description: "",
                product_name: "",
                price: 0,
                qunatity: 0
            })
        }
    }

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Add Product</h2>
            <div>
                <label className="text-sm font-medium">Product Name</label>
                <input
                    type="text"
                    name="product_name"
                    value={productDetails.product_name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF6B2C] outline-none"
                />
            </div>


            <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="product_description"
                    value={productDetails.product_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the product"
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF6B2C] outline-none"
                />
            </div>


            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={productDetails.price}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF6B2C] outline-none"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <input
                        type="number"
                        name="qunatity"
                        value={productDetails.qunatity}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF6B2C] outline-none"
                    />
                </div>
            </div>


            <div>
                <label className="text-sm font-medium mb-2 block">
                    Product Images (up to 5)
                </label>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <label
                            key={index}
                            className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#FF6B2C] transition"
                        >
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">
                                {images[index]?.name || "Upload"}
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageChange(e, index)}
                            />
                        </label>
                    ))}
                </div>
            </div>


            <button
                onClick={() => uploadProduct()}
                type="button"
                className="w-full bg-black text-white rounded-lg py-2 text-sm font-medium hover:opacity-90 transition cursor-pointer"
            >
                Save Product
            </button>
        </div>
    )
}
interface ProductImage {
    id: string;
    image_url: string;
    product_id: string;
}

interface ProductObj {
    id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
    images: ProductImage[];
}
const ProductRow: React.FC<ProductObj> = ({ price, product_name, quantity, images, id }) => {
    return (
        <div className="w-full flex items-center gap-4 px-4 py-3 bg-white rounded-lg border hover:shadow-sm transition">


            <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                <img
                    src={images?.[0]?.image_url || "/placeholder.png"}
                    alt={product_name}
                    className="w-full h-full object-cover"
                />
            </div>


            <div className="w-[160px] text-xs text-gray-500 truncate">
                {id}
            </div>


            <div className="flex-1 font-medium truncate">
                {product_name}
            </div>


            <div className="w-[100px] text-sm font-semibold text-gray-700">
                ₹{price}
            </div>


            <div className="w-[90px] text-sm text-gray-600">
                Qty: {quantity}
            </div>
        </div>
    )
}

export default AdminProducts;