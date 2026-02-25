"use client";
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Skeleton from '@/app/admin/components/ui/Skeleton/Skeleton';
import { normalizeFirestoreDoc } from '@/lib/normalizeFirestoreDoc';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const handleCancel = async () => {
        if (!order) return;
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );
        if (!confirmCancel) return;

        try {
            setUpdating(true);

            await updateDoc(
                doc(db, "orders", order.id),
                {
                    status: "Cancelled",
                }
            );

            // optimistic update
            setOrder((prev) => ({
                ...prev,
                status: "Cancelled",
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        let isMounted = true;
        async function fetchOrder() {
            try {
                const snap = await getDoc(
                    doc(db, "orders", id)
                );
                if (!isMounted) return;

                if (snap.exists()) {
                    const normalized = normalizeFirestoreDoc(snap);
                    setOrder(normalized);
                } else {
                    router.replace("/orders");
                }
            } catch (err) {
                console.error(err);
            } finally {
                if(isMounted) setLoading(false);
            }
        }

        if (id) fetchOrder();
        return () => {isMounted = false};
    }, [id, router]);

    if (loading) {
        return (
            <div className={styles.wrapper}>
                <Skeleton width="200px" height="28px" />
                <Skeleton height="120px" />
                <Skeleton height="200px" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className={styles.wrapper}>
            <h1>Order #{order.id}</h1>
            <div className={styles.card}>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹ {order.totalPrice}</p>
                <p><strong>User:</strong> {order.userEmail}</p>
                <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>
            <div className={styles.items}>
                <h2>Items</h2>

                {order.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <img src={item.image} alt={item.title} />
                        <div>
                            <h3>{item.title}</h3>
                            <p>Qty: {item.quantity}</p>
                            <p>₹ {item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={styles.address}>
                <h2>Shipping Address</h2>
                <p>{order.address?.name}</p>
                <p>{order.address?.street}</p>
                <p>{order.address?.city}</p>
                <p>{order.address?.zip}</p>
            </div>
            {["Placed", "Processing"].includes(order.status) && (
                <button
                    className={styles.cancelBtn}
                    onClick={handleCancel}
                    disabled={updating}
                >
                    {updating ? "Cancelling..." : "Cancel Order"}
                </button>
            )}
        </div>
    )
}