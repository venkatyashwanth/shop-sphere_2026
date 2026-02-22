"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./admin.module.scss";
import { collection, doc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeFirestoreDoc } from "@/lib/normalizeFirestoreDoc";
import OrderDrawer from "./components/OrederDrawer/OrderDrawer";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import FilterBar from "./components/FilterBar/FilterBar";
import SearchBar from "./components/SearchBar/SearchBar";
import { useSorting } from "./hooks/useSorting";
// import { useOrderFilters } from "./hooks/tes";
import { useOrderFilters } from "./hooks/useOrderFilters";

export default function AdminPage() {
    const user = useSelector(state => state.auth.user);
    const router = useRouter();
    const [stats, setStats] = useState({
        orders: 0,
        revenue: 0,
        users: 0,
        products: 0
    })
    const [recentOrders, setRecentOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const FILTER_OPTIONS = [
        "All",
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    const highlightText = (text, search) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <mark key={index} className={styles.highlight}>
                    {part}
                </mark>
            ) : (part)
        )
    }

    const {searchTerm,setSearchTerm,statusFilter,setStatusFilter,filteredOrders,debouncedSearch} = useOrderFilters(recentOrders);
    const {sortConfig,handleSort,sortedData:sortedOrders} = useSorting(filteredOrders);

    const handleOptimisticUpdate = (orderId, newStatus) =>
        setRecentOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o
            )
        )

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const [orderSnap, userSnap, productsSnap] = await Promise.all([
                    getDocs(collection(db, "orders")),
                    getDocs(collection(db, "users")),
                    getDocs(collection(db, "products")),
                ])

                let revenue = 0;
                orderSnap.forEach((doc) => {
                    revenue += doc.data().totalPrice || 0
                })
                setStats({
                    orders: orderSnap.size,
                    revenue,
                    users: userSnap.size,
                    products: productsSnap.size
                })

                // Fetch Recent 5 orders 
                const recentQuery = query(
                    collection(db, "orders"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                )

                const recentSnap = await getDocs(recentQuery);
                const recent = recentSnap.docs.map(normalizeFirestoreDoc);
                setRecentOrders(recent);
            } catch (error) {
                console.error("Error fetching stats: ", error);
            }
        }
        fetchDashboardData();
    }, [])

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/")
        }
    }, [user, router])

    if (!user || user.role !== "admin") return null;

    return (
        <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>🧾</span>
                    <div>
                        <h3>{stats.orders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>💰</span>
                    <div>
                        <h3>₹ {stats.revenue}</h3>
                        <p>Total Revenue</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>👥</span>
                    <div>
                        <h3>{stats.users}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statIcon}>📦</span>
                    <div>
                        <h3>{stats.products}</h3>
                        <p>Total Products</p>
                    </div>
                </div>
            </div>
            <div className={styles.recentSection}>
                <h2>Recent Orders</h2>
                <div className={styles.tableWrapper}>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by Order ID or Email..."/>
                    <FilterBar
                        options={FILTER_OPTIONS}
                        activeFilter={statusFilter}
                        onChange={setStatusFilter}
                    />
                    <OrdersTable
                        debouncedSearch={debouncedSearch}
                        orders={sortedOrders}
                        onSelect={setSelectedOrder}
                        onStatusChange={handleOptimisticUpdate}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        highlightText={highlightText}
                    />
                    <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                </div>
            </div>
        </div>
    )
}