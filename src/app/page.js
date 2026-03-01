"use client";
import StoreToolbar from "@/components/store/StoreToolbar/StoreToolbar";
import styles from "./page.module.scss";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "@/components/store/HeroSection/HeroSection";
import { useSelector } from "react-redux";
import FilterDrawer from "@/components/store/FilterDrawer/FilterDrawer";
import CategoryPills from "@/components/store/CategoryPills/CategoryPills";
import PriceRangeSlider from "@/components/store/PriceRangeSlider/PriceRangeSlider";
import AnimatedCounter from "./admin/components/ui/AnimatedCounter/AnimatedCounter";
import StoreToolbarSkeleton from "@/components/store/StoreToolbar/StoreToolbarSkeleton";

export default function Home() {
  const { items, status } = useSelector((state) => state.products);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  // Active filters (used by ProductGrid)
  const [activeFilters, setActiveFilters] = useState({ category: "All", priceRange: [0, 0] })
  // Draft filters (inside drawer) 
  const [draftFilters, setDraftFilters] = useState({ category: "All", priceRange: [0, 0] })
  const [sortBy, setSortBy] = useState("Newest");
  const prices = items.map(p => p.price).filter(Boolean);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const defaultFilters = useMemo(() => ({
    category: "All",
    priceRange: [minPrice, maxPrice]
  }), [minPrice, maxPrice])

  const categoryItems = items.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {})

  const uniqueCategories = ["All", ...Object.keys(categoryItems)]
  const handleClearFilters = () => {
    setDraftFilters(defaultFilters);
    setActiveFilters(defaultFilters);
  }

  useEffect(() => {
    if (prices.length > 0) {
      const initial = [minPrice, maxPrice];
      setActiveFilters(prev => ({
        ...prev,
        priceRange: initial
      }))
      setDraftFilters(prev => ({
        ...prev,
        priceRange: initial
      }))
    }
  }, [items])

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.category !== "All") count++;
    const isPriceModified = activeFilters.priceRange[0] !== minPrice || activeFilters.priceRange[1] !== maxPrice;
    if (isPriceModified) count++;
    return count;
  }, [activeFilters, minPrice, maxPrice])

  const filteredProducts = useMemo(() => {
    return items
      .filter(product => {
        const matchCategory =
          activeFilters.category === "All" ||
          product.category === activeFilters.category;

        const matchPrice =
          product.price >= activeFilters.priceRange[0] &&
          product.price <= activeFilters.priceRange[1];

        const matchSearch =
          product.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "PriceLow") return a.price - b.price;
        if (sortBy === "PriceHigh") return b.price - a.price;
        if (sortBy === "Newest") return b.createdAt - a.createdAt;
        return 0;
      });
  }, [items, activeFilters, searchTerm, sortBy]);


  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, activeFilters, sortBy])


  return (
    <div className={styles.base}>
      <HeroSection />
      {status !== "success" ?
        <StoreToolbarSkeleton />
        :
        <StoreToolbar
          uniqueCategories={uniqueCategories}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          prices={prices}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApply={() => setActiveFilters(draftFilters)}
          onClear={() => handleClearFilters()}
        />
      }

      <div className={`${styles.gridWrapper} ${isFiltering ? styles.blur : ''}`}>
        <button className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)}>
          Filter ⚙
          {activeFilterCount > 0 && (
            <span className={styles.filterBadge}>
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className={styles.resultInfo}>
          Showing <AnimatedCounter value={filteredProducts.length} duration={400} />{" "}
          {filteredProducts.length === 1 ? "result" : "results"}
        </div>
        <ProductGrid products={filteredProducts} />
      </div>
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={() => {
          setActiveFilters(draftFilters);
          setDrawerOpen(false);
        }}
        onClear={() => {
          handleClearFilters();
          setDrawerOpen(false);
        }}
      >
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
      </FilterDrawer>
    </div>
  );
}
