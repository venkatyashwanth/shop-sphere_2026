"use client";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.scss";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/features/products/productsSlice";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";
export default function ProductGrid({
    searchTerm,
    categoryFilter,
    sortBy,
    priceRange,
}) {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.products);
    const gridRef = useRef(null);

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
        .filter(product =>
            product.price >= priceRange[0] &&
            product.price <= priceRange[1]
        )

        useEffect(() => {
        if (!gridRef.current) return;

        const el = gridRef.current;
        const prevHeight = el.offsetHeight;

        requestAnimationFrame(() => {
            const newHeight = el.scrollHeight;

            el.style.height = prevHeight + "px";

            requestAnimationFrame(() => {
                el.style.height = newHeight + "px";
            });

            const cleanup = () => {
                el.style.height = "auto";
                el.removeEventListener("transitionend", cleanup);
            };

            el.addEventListener("transitionend", cleanup);
        });
    }, [filteredProducts]);


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
            <div className={styles.grid} ref={gridRef} >
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    )
}