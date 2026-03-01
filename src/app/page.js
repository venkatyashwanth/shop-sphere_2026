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

export default function Home() {
  const { items } = useSelector((state) => state.products);
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
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 0]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const categoryItems = items.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {})

  const uniqueCategories = ["All", ...Object.keys(categoryItems)]


  useEffect(() => {
    if (prices.length > 0) {
      setPriceRange([minPrice, maxPrice])
    }
  }, [items])

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
    }, 450);
    return () => clearTimeout(timer);
  }, [priceRange])

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter, sortBy, debouncedPriceRange])


  return (
    <div className={styles.base}>
      <HeroSection />
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
        onApply ={() => setActiveFilters(draftFilters)}
      />
      <div className={`${styles.gridWrapper} ${isFiltering ? styles.blur : ''}`}>
        <button className={styles.mobileFilterBtn} onClick={() => setDrawerOpen(true)}> Filter ⚙</button>
        <ProductGrid
          activeFilters={activeFilters}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          priceRange={debouncedPriceRange}
        />
      </div>
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApply={() => {
          setActiveFilters(draftFilters);
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
