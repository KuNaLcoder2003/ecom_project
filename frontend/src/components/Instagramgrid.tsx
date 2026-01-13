const InstagramGrid = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-32">
            <h2 className="text-3xl font-bold mb-8">Follow Our Instagram</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <img key={i} src="./assets/insta.png" className="rounded-lg" />
                ))}
            </div>
        </section>
    );
};

export default InstagramGrid;
