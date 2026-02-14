"use client";

import { useDispatch, useSelector } from "react-redux";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { clearCart, decreaseQuanity, increaseQuantity, removeItem } from "@/features/cart/cartslice";
import Link from "next/link";

export default function CartPage() {
    const { items, totalPrice } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    if (items.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started.</p>
                <Link href="/">
                    <button className={styles.shopButton}>Continue Shopping</button>
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.items}>
                {items.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.image} style={{ backgroundImage: `url(${item.image})` }} />

                        <div className={styles.details}>
                            <h3>{item.title}</h3>
                            <p>{item.price}</p>

                            <div className={styles.controls}>
                                <button onClick={() => dispatch(decreaseQuanity(item.id))}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                            </div>

                            <button className={styles.remove} onClick={() => dispatch(removeItem(item.id))}>Remove</button>
                        </div>

                    </div>
                ))}
            </div>
            <div className={styles.summary}>
                <h3>Order Summary</h3>
                <p>Total: ₹{totalPrice}</p>

                <button className={styles.checkout}>
                    Proceed to Checkout
                </button>
                <button className={styles.clear} onClick={() => dispatch(clearCart())}>
                    Clear cart
                </button>
            </div>
        </div>
    )
}
