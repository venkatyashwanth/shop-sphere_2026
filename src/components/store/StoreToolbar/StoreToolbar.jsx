import { useSelector } from "react-redux";
import styles from "./StoreToolbar.module.scss";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import CategoryPills from "../CategoryPills/CategoryPills";
export default function StoreToolbar({
    uniqueCategories,
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

    return (
        <div className={styles.storeToolbar}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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