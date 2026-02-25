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
    const [highlightId, setHighlightId] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isFading, setIsFading] = useState(false);
    const [searchTerm,setSearchTerm] = useState("");

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
    },[])

    const handleEdit = (product) => {
        setEditingProduct(product);
        setHighlightId(product.id);
        setTimeout(() => {
            setHighlightId(null);
        }, 1200);
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Delete this product?"
        );
        if (!confirmDelete) return;

        await deleteDoc(doc(db, "products", id));
    };

    const categoryCounts = products.reduce((acc, product) => {
        const cat = product.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {})

    const uniqueCategories = ["All", ...Object.keys(categoryCounts)];
    

    // const filteredProducts = categoryFilter === "All" ? products : products.filter((p) => p.category === categoryFilter);
    const filteredProducts = products
        .filter((product) => {
            if(categoryFilter === "All") return true;
            return product.category === categoryFilter;
        })
        .filter((product) => {
            if(!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return(
                product.title?.toLowerCase().includes(search) ||
                product.category?.toLowerCase().includes(search) ||
                String(product.price).includes(search)
            )
        })

    return (
        <div className={styles.wrapper}>
            <h1>Products page</h1>
            <ProductForm editingProduct={editingProduct} clearEdit={() => setEditingProduct(null)} setHighlightId={setHighlightId} />
            <div className={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    />
                <select
                    value={categoryFilter}
                    onChange={(e) => {
                        const value = e.target.value;
                        setCategoryFilter(value);
                        setIsFading(true);
                        setTimeout(() => {
                            // setCategoryFilter(value);
                            setIsFading(false);
                        }, 150)
                    }}
                    className={styles.filterSelect}
                >
                    {uniqueCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat === "All"
                                ? `All (${products.length})`
                                : `${cat} (${categoryCounts[cat]})`}
                        </option>
                    ))}
                </select>
            </div>
            <div className={`${styles.tableWrapper} ${isFading ? styles.fade : ""}`}>
                <ProductTable
                    products={filteredProducts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    highlightId={highlightId}
                />
            </div>
        </div>
    )
}