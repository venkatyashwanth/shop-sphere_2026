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

    return (
        <div className={styles.wrapper}>
            <h1>Products page</h1>
            <ProductForm editingProduct={editingProduct} clearEdit={() => setEditingProduct(null)} setHighlightId={setHighlightId}/>
            <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                highlightId={highlightId}
            />
        </div>
    )
}