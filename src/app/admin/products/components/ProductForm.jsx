import { db } from "@/lib/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "./ProductForm.module.scss";

export default function ProductForm({
    editingProduct,
    clearEdit,
    setHighlightId
}) {
    const [form, setForm] = useState({
        title: "",
        price: "",
        category: "",
        image: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setForm(editingProduct);
        }
    }, [editingProduct]);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingProduct) {
                await updateDoc(
                    doc(db, "products", editingProduct.id),
                    form
                );
                clearEdit();
                setHighlightId(editingProduct.id);
            } else {
                await addDoc(collection(db, "products"), {
                    ...form,
                    price: Number(form.price),
                    createdAt: serverTimestamp(),
                });
            }

            setForm({
                title: "",
                price: "",
                category: "",
                image: "",
                description: "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>

                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input
                    name="price"
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <input
                    name="category"
                    placeholder="Category"
                    value={form.category}
                    onChange={handleChange}
                />

                <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />
            </div>

            <button disabled={loading} className={styles.submit}>
                {editingProduct
                    ? "Update Product"
                    : "Add Product"}
            </button>
        </form>
    )
}