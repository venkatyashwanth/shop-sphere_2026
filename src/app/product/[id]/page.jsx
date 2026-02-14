"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { addToCart } from "@/features/cart/cartslice";
import { normalizeFirestoreDoc } from "@/lib/normalizeFirestoreDoc";
import ProductDetailsSkeleton from "@/components/ProductDetailsSkeleton/ProductDetailsSkeleton";
import ProductCard from "@/components/ProductCard/ProductCard";
import { fetchProducts } from "@/features/products/productsSlice";


export default function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const allproducts = useSelector((state) => state.products.items);
    const productsStatus = useSelector((state) => state.products.status);

    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(normalizeFirestoreDoc(docSnap));
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.log(error);
                setStatus("error");
            }
        }
        fetchProduct();
    }, [id])

    useEffect(() => {
        if (productsStatus === "idle") {
            dispatch(fetchProducts());
        }
    }, [productsStatus, dispatch]);





    // ✅ AFTER ALL HOOKS
    if (status !== "success") {
        return <ProductDetailsSkeleton />
    }

    if (status === 'error') {
        return <div className={styles.error}>Product not found.</div>
    }

    // if(!product) return null;
    const blurURL = product.image.replace(
        "/upload/",
        "/upload/w_20,q_10,e_blur:1000/"
    );
    const relatedProducts = product ? allproducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4) : [];
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={`${styles.image} ${imageLoaded ? styles.loaded : ""}`}
                        placeholder="blur"
                        blurDataURL={blurURL}
                        onLoadingComplete={() => setImageLoaded(true)}
                    />

                </div>
                <div className={styles.info}>
                    <h1>{product.title}</h1>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.price}>₹{product.price}</p>

                    <p className={styles.description}>
                        {product.description}
                    </p>
                    <button className={styles.button} onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className={styles.relatedSection}>
                    <h2>Related Products</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}