import type React from "react";
import { useEffect, useState } from "react";
import useProducts from "../hooks/useProducts";
import toast, { Toaster } from "react-hot-toast";
import { ImagePlus, Loader, X } from "lucide-react";
type tabs = "Products" | "Add Product"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AdminProducts: React.FC = () => {
    const [tab, setTab] = useState<tabs>("Products")
    const { products, error, loading } = useProducts()

    if (error) {
        toast.error(error)
        return <></>
    }
    if (products?.length == 0) {
        return <p>No product added yet</p>
    }
    return (
        <>
            {
                loading ? <Loader /> : <div className="w-full space-y-4 p-4">
                    <Toaster />
                    <div className="flex items-center gap-4 w-xl">
                        <div onClick={() => setTab("Products")} className={`${tab == "Products" ? "bg-black text-white rounded-lg" : ""} px-6 py-2 text-center cursor-pointer`}>Products</div>
                        <div onClick={() => setTab("Add Product")} className={`${tab == "Add Product" ? "bg-black text-white rounded-lg" : ""} px-6 py-2 text-center cursor-pointer`}>Add Product</div>
                    </div>

                    <div className="w-full h-screen overflow-y-scroll flex flex-col items-baseline gap-4">
                        {
                            tab == "Products" && products?.map(product => {
                                return (
                                    <ProductRow variant_id={product.id} color={product.color} size={product.size} images={product.images} price={product.price} quantity={product.quantity} id={product.product.id} product_name={product.product.product_name} product_description={product.product.product_name} key={product.id} />
                                )
                            })
                        }
                    </div>


                    {
                        tab == "Add Product" && <AddProduct />
                    }
                </div>
            }
        </>
    )
}


interface Product_Variant {
    price: number,
    quantity: number,
    color: string,
    size: string
}

const AddProduct: React.FC = () => {

    useEffect(() => {
        console.log("AddProduct mounted");
    }, []);
    const [productDetails, setProductDetails] = useState({
        product_name: "",
        product_description: "",
    });

    const [productVariants, setProductVariants] = useState<Product_Variant[]>([])

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

        if (!productDetails.product_name || !productDetails.product_description || productVariants.length == 0) {
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
        // formData.append('price', `${productDetails.price}`);
        // formData.append('qunatity', `${productDetails.qunatity}`);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
        for (let i = 0; i < productVariants.length; i++) {
            formData.append('variants', JSON.stringify(productVariants[i]))
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
                // price: 0,
                // qunatity: 0
            })
        } catch (error) {
            toast.error("Something went wrong")
            setImages([])
            setProductDetails({
                product_description: "",
                product_name: "",
                // price: 0,
                // qunatity: 0
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

            <ProductVariants productVariants={productVariants} setProductVariant={setProductVariants} />

            <div>
                <label className="text-sm font-medium mb-2 block">
                    Product Images (up to 5)
                </label>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <label
                            htmlFor={`product-image-${index}`}
                            key={index}
                            className="relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#FF6B2C] transition"
                        >
                            <ImagePlus className="w-6 h-6 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">
                                {images[index]?.name || "Upload"}
                            </span>

                            <input
                                type="file"
                                id={`product-image-${index}`}
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
    variant_id: string;
    product_name: string;
    product_description: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    images: ProductImage[];

}
const ProductRow: React.FC<ProductObj> = ({
    price,
    product_name,
    quantity,
    images,
    id,
    variant_id,
    color,
    size
}) => {
    return (
        <div className="w-full group relative flex items-center gap-5 rounded-2xl bg-white px-5 py-4 transition-all hover:shadow-md hover:border-gray-300">

            {/* Image */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img
                    src={images?.[0]?.image_url || "/placeholder.png"}
                    alt={product_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            {/* Product Info */}
            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-gray-900">
                    {product_name}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5">
                        {color}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5">
                        {size}
                    </span>
                </div>

                <div className="flex item-center gap-2">
                    <span className="text-[11px] text-gray-400 truncate">
                        <span className="font-bold">ID</span>: {id}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate">
                        <span className="font-bold">Varinat ID</span>: {variant_id}
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold text-gray-900">
                    ₹{price}
                </span>

                <span className="text-xs text-gray-500">
                    Qty · {quantity}
                </span>
            </div>
        </div>
    )
}


const ProductVariants: React.FC<{ productVariants: Product_Variant[], setProductVariant: React.Dispatch<React.SetStateAction<Product_Variant[]>> }> = ({ productVariants, setProductVariant }) => {
    const [size, setSize] = useState<string>("")
    const [color, setColors] = useState<string>("")
    const [quantity, setQuantity] = useState<number>(1)
    const [price, setPrice] = useState<number>(0);

    const addVariant = () => {
        if (!size || !color || quantity <= 0 || price <= 0) {
            toast.error("Please enter all details")
            return
        }
        const exists = productVariants.some(item => item.color == color && item.size == size)
        if (exists) {
            toast.error("Variant already exists")
            return
        }
        setProductVariant(val => [...val, { price, quantity, size, color }])
        setColors("")
        setQuantity(1)
    }

    const removeVariant = (index: number) => {
        setProductVariant(val => val.filter((_, idx) => idx !== index))
    }
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold">Product Variants</h3>

            <div className="grid grid-cols-3 gap-3">
                <input
                    placeholder="Size (S, M, L)"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                    placeholder="Color (Red, Blue)"
                    value={color}
                    onChange={e => setColors(e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                />

                <input
                    type="number"
                    placeholder="Qty"
                    value={quantity}
                    onChange={e => setQuantity(+e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={e => setPrice(+e.target.value)}
                    className="rounded-lg border px-3 py-2 text-sm"
                />
            </div>

            <button
                type="button"
                onClick={addVariant}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg"
            >
                Add Variant
            </button>

            {productVariants.length > 0 && (
                <div className="space-y-2">
                    {productVariants.map((variant, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between border rounded-lg px-3 py-2 text-sm"
                        >
                            <span>
                                {variant.color} / {variant.size} — Qty: {variant.quantity}
                            </span>

                            <button
                                onClick={() => removeVariant(index)}
                                className="text-red-500"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdminProducts;