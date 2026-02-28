"use client";
import StoreToolbar from "@/components/store/StoreToolbar/StoreToolbar";
import styles from "./page.module.scss";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { useState } from "react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  return (
    <div className={styles.base}>
      <StoreToolbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ProductGrid 
        searchTerm={searchTerm}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
      />
    </div>
  );
}
