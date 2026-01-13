import ProductPreview from "./ProductPreview";

const PopularFabrics = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-32">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Most Popular Fabrics</h2>
                <span className="text-sm cursor-pointer">View All</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <ProductPreview
                        key={i}
                        image_url="./assets/cover.png"
                        product_name="Printed Shirt"
                        product_price="$35.00"
                    />
                ))}
            </div>
        </section>
    );
};

export default PopularFabrics;
