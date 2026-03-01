import { useSelector } from "react-redux";
import styles from "./StoreToolbar.module.scss";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import CategoryPills from "../CategoryPills/CategoryPills";
export default function StoreToolbar({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    minPrice,
    maxPrice,
    priceRange,
    setPriceRange
}) {
    const { items } = useSelector((state) => state.products);
    const categoryItems = items.reduce((acc, product) => {
        const cat = product.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {})

    const uniqueCategories = ["All", ...Object.keys(categoryItems)]

    return (
        <div className={styles.storeToolbar}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                {uniqueCategories.map((cat) =>
                    <option key={cat} value={cat}>
                        {cat === "All"
                            ? `All (${items.length})`
                            : `${cat} (${categoryItems[cat]})`}
                    </option>
                )}
            </select> */}
            <CategoryPills
                categories={uniqueCategories}
                activeCategory={categoryFilter}
                setActiveCategory={setCategoryFilter}
            />
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="Newest">Newest</option>
                <option value="PriceLow">Price: Low → High</option>
                <option value="PriceHigh">Price: High → Low</option>
            </select>
            <PriceRangeSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                range={priceRange}
                setRange={setPriceRange}
            />
        </div>
    )
}