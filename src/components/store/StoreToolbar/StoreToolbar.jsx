import { useSelector } from "react-redux";
import styles from "./StoreToolbar.module.scss";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import CategoryPills from "../CategoryPills/CategoryPills";
export default function StoreToolbar({
    uniqueCategories,
    draftFilters,
    setDraftFilters,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    minPrice,
    maxPrice,
    onApply
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
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
            >
                <option value="Newest">Newest</option>
                <option value="PriceLow">Price: Low → High</option>
                <option value="PriceHigh">Price: High → Low</option>
            </select>
            <CategoryPills
                categories={uniqueCategories}
                activeCategory={draftFilters.category}
                setActiveCategory={(cat) => setDraftFilters(prev => ({ ...prev, category: cat }))}
            />

            <PriceRangeSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                range={draftFilters.priceRange}
                setRange={(range) => setDraftFilters(prev => ({ ...prev, priceRange: range }))}
            />
            <button className={styles.applyBtn} onClick={onApply}>Apply</button>
        </div>
    )
}