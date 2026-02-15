"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Order() {
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?redirect=/orders");
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                const snapshot = await getDocs(q);

                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))

                setOrders(data);
            } catch (err) {
                console.error("Fetch Orders Error: ", err);
            }
            setLoading(false);
        }
        fetchOrders();
    }, [user])

    // if(loading) return <p className={styles.loading}>Loading Orders...</p>
    if (loading) return (
        <div className={styles.wrapper}>
            <h1>My Orders</h1>
            {[1, 2, 3].map((i) => (
                <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div>
                            <div className={styles.skeletonOrderId}></div>
                            <div className={styles.skeletonDate}></div>
                        </div>
                        <div className={styles.skeletonStatus}></div>
                    </div>
                    {/* Items */}
                    <div className={styles.items}>
                        {[1].map((j) => (
                            <div key={j} className={styles.item}>
                                <div className={styles.skeletonImage}></div>
                                <div className={styles.skeletonTextGroup}>
                                    <div className={styles.skeletonTitle}></div>
                                    <div className={styles.skeletonQuantity}></div>
                                </div>
                                <div className={styles.skeletonPrice}></div>
                            </div>
                        ))}
                    </div>
                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.skeletonTotal}></div>
                    </div>
                </div>
            ))}
        </div>
    )

    if (orders.length === 0) return <p className={styles.empty}>No orders yet.</p>

    return (
        <div className={styles.wrapper}>
            <h1>My Orders</h1>
            <div className={`${styles.fadeIn} ${styles.animWrapper}`}>
                {orders.map((order) => (
                    <div key={order.id} className={styles.card}>
                        <div className={styles.header}>
                            <div>
                                <p className={styles.orderId}>
                                    Order #{order.id.slice(0, 8)}
                                </p>
                                <p className={styles.date}>
                                    {order.createdAt?.toDate
                                        ? new Date(order.createdAt.toDate()).toLocaleDateString()
                                        : "Recently"}
                                </p>
                            </div>
                            <span className={`${styles.status} ${styles[order.status]}`}>{order.status}</span>
                        </div>
                        <div className={styles.items}>
                            {order.items.map((item) => (
                                <div key={item.id} className={styles.item}>
                                    <div className={styles.image} style={{ backgroundImage: `url(${item.image})` }} />

                                    <div className={styles.itemInfo}>
                                        <span className={styles.title}>
                                            {item.title}
                                        </span>
                                        <span className={styles.quantity}>
                                            x {item.quantity}
                                        </span>
                                    </div>
                                    <span className={styles.price}>
                                        ₹{item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.footer}>
                            <strong>Total: ₹{order.totalPrice}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}