const BestCategory = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div>
                <h2 className="text-3xl font-bold mb-6">
                    Best Selling Category <br /> in Last Month
                </h2>

                <ul className="space-y-2 text-stone-600">
                    <li>Silk</li>
                    <li>Linen</li>
                    <li>Viscose</li>
                    <li>Cashmere</li>
                </ul>
            </div>

            <div>
                <img src="./assets/category.png" className="rounded-xl" />
            </div>
        </section>
    );
};

export default BestCategory;
