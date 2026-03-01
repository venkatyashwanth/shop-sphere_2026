import styles from "./StoreToolbar.module.scss";
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";
import CategoryPills from "../CategoryPills/CategoryPills";
export default function StoreToolbar({
    uniqueCategories,
    draftFilters,
    setDraftFilters,
    searchTerm,
    setSearchTerm,
    minPrice,
    maxPrice,
    onApply,
    onClear
}) {

    return (
        <div className={styles.storeToolbar}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
                value={draftFilters.sort}
                onChange={(e) => 
                    setDraftFilters(prev => ({
                        ...prev,
                        sort: e.target.value
                    }))
                }
            >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
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
            <button className={`${styles.clearBtn} ${styles.clear}`} onClick={onClear}>Clear</button>
        </div>
    )
}