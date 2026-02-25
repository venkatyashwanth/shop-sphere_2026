"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ProductForm from "./components/ProductForm";
import { normalizeFirestoreDoc } from "@/lib/normalizeFirestoreDoc";
import ProductTable from "./components/ProductTable";
export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [highlightId,setHighlightId] = useState(null);
    const [categoryFilter,setCategoryFilter] = useState("All");

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "products"),
            (snapshot) => {
                const data = snapshot.docs.map(
                    normalizeFirestoreDoc
                );
                setProducts(data);
            }
        );
        return () => unsubscribe();
    })

    const handleEdit = (product) => {
        setEditingProduct(product);
        setHighlightId(product.id);
        setTimeout(() => {
            setHighlightId(null);
        },1200);
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this product?"
        );
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "products", id));
    };

    const uniqueCategories = [
        "All", ...new Set(products.map((p) => p.category))
    ]

    const filteredProducts = categoryFilter === "All" ? products : products.filter((p) => p.category === categoryFilter);

    return (
        <div className={styles.wrapper}>
            <h1>Products page</h1>
            <ProductForm editingProduct={editingProduct} clearEdit={() => setEditingProduct(null)} setHighlightId={setHighlightId}/>
            <div className={styles.filterBar}>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={styles.filterSelect}>
                    {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <ProductTable
                products={filteredProducts}
                onEdit={handleEdit}
                onDelete={handleDelete}
                highlightId={highlightId}
            />
        </div>
    )
}