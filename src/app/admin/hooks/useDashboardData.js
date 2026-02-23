"use client";

import { db } from "@/lib/firebase";
import { normalizeFirestoreDoc } from "@/lib/normalizeFirestoreDoc";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function useDashboardData() {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        orders: 0,
        revenue: 0,
        users: 0,
        products: 0,
    })
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        async function fetchDashboardData() {
            try {
                setLoading(true);

                unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
                    const normalizedOrders = snapshot.docs.map(normalizeFirestoreDoc);
                    let revenue = 0;
                    normalizedOrders.forEach((order) => {
                        revenue += order.totalPrice || 0;
                    });
                    setOrders(normalizedOrders);
                    setStats((prev) => ({
                        ...prev,
                        orders: normalizedOrders.length,
                        revenue
                    }))
                    setLoading(false);
                })

                const [usersSnap, productsSnap] = await Promise.all([
                    getDocs(collection(db, "users")),
                    getDocs(collection(db, "products"))
                ])

                setStats((prev) => ({
                    ...prev,
                    users: usersSnap.size,
                    products: productsSnap.size,
                }));
                // const [ordersSnap, usersSnap, productsSnap] = await Promise.all([
                //     getDocs(collection(db, "orders")),
                //     getDocs(collection(db, "users")),
                //     getDocs(collection(db, "products"))
                // ])
                // const normalizedOrders = ordersSnap.docs.map(normalizeFirestoreDoc);

                // setStats({
                //     orders: normalizedOrders.length,
                //     revenue,
                //     users: usersSnap.size,
                //     products: productsSnap.size,
                // })
            }
            catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();

        return () => {
            if(unsubscribe) unsubscribe();
        }
    }, [])

    return {
        orders,
        setOrders,
        stats,
        selectedOrder,
        setSelectedOrder,
        loading
    }
}