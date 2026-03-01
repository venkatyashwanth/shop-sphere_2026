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
import MobileFilterBar from "@/components/store/MobileFilterBar/MobileFilterBar";
import MobileSearchOverlay from "@/components/store/MobileSearchOverlay/MobileSearchOverlay";

export default function Home() {
  const { items, status } = useSelector((state) => state.products);
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest");
  const prices = items.map(p => p.price).filter(Boolean);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const defaultFilters = useMemo(() => ({
    category: "All",
    priceRange: [minPrice, maxPrice],
    sort: "Newest"
  }), [minPrice, maxPrice])

  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [activeFilters, setActiveFilters] = useState(defaultFilters);

  const categoryItems = items.reduce((acc, product) => {
    const cat = product.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {})

  const uniqueCategories = ["All", ...Object.keys(categoryItems)]
  const handleClearFilters = () => {
    setDraftFilters(prev => ({
      ...defaultFilters
    }));
    setActiveFilters(prev => ({
      ...defaultFilters
    }));
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
            .includes(debouncedSearchTerm.toLowerCase());

        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        const sortType = activeFilters.sort || "Newest";
        if (sortType === "PriceLow") return a.price - b.price;
        if (sortType === "PriceHigh") return b.price - a.price;
        if (sortType === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortType === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
      });
  }, [activeFilters, debouncedSearchTerm]);

  const activeChips = [];
  // CATEGORY
  if (activeFilters.category !== "All") {
    activeChips.push({
      type: "category",
      label: `Category: ${activeFilters.category}`
    })
  }

  // PRICE
  const isPriceModified = activeFilters.priceRange[0] !== minPrice || activeFilters.priceRange[1] !== maxPrice;
  if (isPriceModified) {
    activeChips.push({
      type: "price",
      label: `₹${activeFilters.priceRange[0]} – ₹${activeFilters.priceRange[1]}`,
    })
  }

  // SEARCH
  if (debouncedSearchTerm.trim() !== "") {
    activeChips.push({
      type: "search",
      label: `Seach: "${debouncedSearchTerm}"`
    })
  }

  // SORT
  if (activeFilters.sort !== "Newest") {
    const sortLabelMap = {
      Oldest: "Oldest",
      PriceLow: "Price: Low  → High",
      PriceHigh: "Price: High  → Low"
    }
    activeChips.push({
      type: "sort",
      label: `Sort: ${sortLabelMap[activeFilters.sort]}`
    })
  }

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, activeFilters, sortBy])

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])


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
          prices={prices}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onApply={() => setActiveFilters(draftFilters)}
          onClear={() => handleClearFilters()}
        />
      }

      <div className={`${styles.gridWrapper} ${isFiltering ? styles.blur : ''}`}>
        {activeChips.length > 0 && (
          <div className={styles.activeFilterRow}>
            {activeChips.map((chip) => (
              <button
                key={chip.type}
                className={styles.filterChip}
                onClick={() => {
                  if (chip.type === "category") {
                    setActiveFilters(prev => ({
                      ...prev,
                      category: "All"
                    }))
                  }
                  if (chip.type === "price") {
                    setActiveFilters(prev => ({
                      ...prev,
                      priceRange: [minPrice, maxPrice]
                    }))
                  }
                  if (chip.type === "search") {
                    setSearchTerm("")
                  }
                  if (chip.type === "sort") {
                    setActiveFilters(prev => ({
                      ...prev,
                      sort: "Newest"
                    }))
                  }
                }}
              >
                {chip.label}
                <span className={styles.closeIcon}>✕</span>
              </button>
            ))}
          </div>
        )}
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
        <div className={styles.sortSection}>
          <label htmlFor="productSort">Sort By</label>
          <select id="productSort"
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
        </div>
      </FilterDrawer>
      <MobileFilterBar
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setDrawerOpen(true)}
        onOpenSearch={() => {
          setSearchOpen(true)
        }}
        onOpenSort={() => {
          setDrawerOpen(true)
        }}
      />
      <MobileSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        results={filteredProducts}
      />
    </div>
  );
}
