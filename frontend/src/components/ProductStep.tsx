const ProductStep = ({ products, onNext }: any) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

            <h2 className="text-2xl font-semibold font-[Interif]">
                Order Summary
            </h2>

            <div className="space-y-4">
                {products.map((item: any) => (
                    <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-xl bg-zinc-50"
                    >
                        <img
                            src={item.images[0].image_url}
                            className="w-20 h-24 rounded-lg object-cover"
                        />

                        <div className="flex flex-col justify-between w-full">
                            <div>
                                <h3 className="font-medium">{item.product_name}</h3>
                                <p className="text-sm text-zinc-500">
                                    Qty: {item.qunatity}
                                </p>
                            </div>

                            <p className="font-semibold text-right">
                                ₹ {item.price * item.qunatity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-between font-semibold">
                <span>Total</span>
                <span>
                    ₹ {products.reduce((acc: number, i: any) => acc + i.price * i.qunatity, 0)}
                </span>
            </div>

            <button
                onClick={onNext}
                className="w-full py-3 bg-black text-white rounded-xl"
            >
                Continue to Address
            </button>
        </div>
    )
}

export default ProductStep
