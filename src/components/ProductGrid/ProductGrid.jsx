"use client";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.scss";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/features/products/productsSlice";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";
export default function ProductGrid({
    searchTerm,
    categoryFilter,
    sortBy
}) {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.products);

    const activeProducts = items.filter(p => p.active !== false);
    const filteredProducts = activeProducts
        .filter(product => {
            if (categoryFilter === "All") return true;
            return product.category === categoryFilter;
        })
        .filter(product => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                product.title?.toLowerCase().includes(search) ||
                product.category?.toLowerCase().includes(search)
            )
        })
        .sort((a, b) => {
            if (sortBy === "PriceLow") return a.price - b.price;
            if (sortBy === "PriceHigh") return b.price - a.price;
            if (sortBy === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
            return 0;
        })


    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProducts());
        }
    }, [dispatch, status])

    if (status !== "success") {
        return (
            <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (status === "error") return <p>{error}</p>
    return (
        <>
            <div className={styles.grid}>
                {/* {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))} */}
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    )
}