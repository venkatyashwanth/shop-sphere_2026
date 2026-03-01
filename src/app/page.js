"use client";
import StoreToolbar from "@/components/store/StoreToolbar/StoreToolbar";
import styles from "./page.module.scss";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "@/components/store/HeroSection/HeroSection";
import { useSelector } from "react-redux";

export default function Home() {
  const { items } = useSelector((state) => state.products);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const prices = items.map(p => p.price).filter(Boolean);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 0]);

  useEffect(() => {
    if (prices.length > 0) {
      setPriceRange([minPrice, maxPrice])
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
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        prices={prices}
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
      <div className={`${styles.gridWrapper} ${isFiltering ? styles.blur : ''}`}>
        <ProductGrid
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          sortBy={sortBy}
          priceRange={debouncedPriceRange}
        />
      </div>

    </div>
  );
}
