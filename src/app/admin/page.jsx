"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./admin.module.scss";
import { collection, doc, getDocs, limit, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeFirestoreDoc } from "@/lib/normalizeFirestoreDoc";

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
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");

    const STATUS_OPTIONS = [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    const FILTER_OPTIONS = [
        "All",
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            setRecentOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            await updateDoc(doc(db, "orders", orderId), {
                status: newStatus
            })
            setActiveDropdown(null);
        } catch (error) {
            console.error("status update failed: ", error);
        } finally {
            setUpdatingId(null);
        }
    }

    const filteredOrders = statusFilter === "All" ? recentOrders : recentOrders.filter((order) => (order.status || "Placed") === statusFilter);


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
        const handleClickOutside = (e) => {
            if (!e.target.closest(`.${styles.statusWrapper}`)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])

    useEffect(() => {
        if (!selectedOrder) return;
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setSelectedOrder(null);
            }
        }
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [selectedOrder])

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
                    <div className={styles.filterBar}>
                        {FILTER_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => setStatusFilter(option)}
                                className={`${styles.filterBtn} ${statusFilter === option ? styles.activeFilter : ""}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>
                                    Order ID
                                </th>
                                <th>
                                    User
                                </th>
                                <th>
                                    Total
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={styles.clickableRow}
                                >
                                    <td>
                                        {order.id.slice(0, 6)}...
                                    </td>
                                    <td>
                                        {order.userEmail || "—"}
                                    </td>
                                    <td>
                                        ₹ {order.totalPrice}
                                    </td>
                                    <td className={styles.statusCell}>
                                        <div className={styles.statusWrapper}>
                                            <button
                                                disabled={updatingId === order.id}
                                                className={`${styles.statusBadge} ${styles[`status_${(order.status || "placed").toLowerCase()}`]}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === order.id ? null : order.id)
                                                }}
                                            >
                                                {updatingId === order.id && (
                                                    <span className={styles.spinner}></span>
                                                )}
                                                <span className={updatingId === order.id ? styles.hiddenText : ""}>
                                                    {order.status || "Placed"}
                                                </span>

                                            </button>
                                            {activeDropdown === order.id && (
                                                <div className={styles.statusDropdown}>
                                                    {STATUS_OPTIONS.map((status) => (
                                                        <button key={status}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(order.id, status)
                                                            }}
                                                        >{status}</button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                    </td>
                                    <td>
                                        {console.log(order.createdAt)}
                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedOrder && (
                        <>
                            <div
                                className={styles.backdrop}
                                onClick={() => setSelectedOrder(null)}
                            >
                            </div>
                            <div className={styles.drawer}>
                                <button
                                    className={styles.closeBtn}
                                    onClick={() => setSelectedOrder(null)}
                                >✕</button>
                                <h2>Order Details</h2>
                                <div className={styles.detailBlock}>
                                    <strong>Order ID: </strong>
                                    <p>{selectedOrder.id}</p>
                                </div>
                                <div className={styles.detailBlock}>
                                    <strong>User: </strong>
                                    <p>{selectedOrder.userEmail}</p>
                                </div>
                                <div className={styles.detailBlock}>
                                    <strong>Status: </strong>
                                    <p>{selectedOrder.status}</p>
                                </div>
                                <div className={styles.detailBlock}>
                                    <strong>Total: </strong>
                                    <p>₹{selectedOrder.totalPrice}</p>
                                </div>
                                <div className={styles.detailBlock}>
                                    <strong>Address:</strong>
                                    <p>{selectedOrder.address?.street}</p>
                                    <p>{selectedOrder.address?.city}</p>
                                </div>
                                <div className={styles.itemsBlock}>
                                    <strong>Items:</strong>
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className={styles.itemRow}>
                                            <span>{item.title}</span>
                                            <span>x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}