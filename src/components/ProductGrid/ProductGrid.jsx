"use client";
import { useDispatch, useSelector } from "react-redux";

import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.scss";
import { useEffect } from "react";
import { fetchProducts } from "@/features/products/productsSlice";
import ProductCardSkeleton from "../ProductCardSkeleton/ProductCardSkeleton";
export default function ProductGrid() {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector((state) => state.products);

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
        <div className={styles.grid}>
            {items.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}