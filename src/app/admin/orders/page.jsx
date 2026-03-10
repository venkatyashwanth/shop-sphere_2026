"use client";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import styles from "./order.module.scss";
import OrdersTable from "../components/Orders/OrdersTable";
import OrdersStats from "../components/Orders/OrderStats/OrdersStats";
import OrdersToolbar from "../components/Orders/OrdersToolbar";
import Pagination from "../components/Orders/Pagination/Pagination";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading,setLoading] = useState(true);

    const limit = 5; // orders per page
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(search.toLowerCase()) ||
                order.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                order.items[0].title.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        })
    }, [orders, search, statusFilter])

    const sortedOrders = useMemo(() => {
        const sorted = [...filteredOrders];
        sorted.sort((a, b) => {
            if (sortBy === "status") {
                return a.status.localeCompare(b.status);
            }
            if (sortBy === "price") {
                return a.price - b.price;
            }
            if (sortBy === "date") {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }

            return 0;
        })
        return sortOrder === "asc" ? sorted : sorted.reverse();

    }, [filteredOrders, sortBy, sortOrder]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return sortedOrders.slice(startIndex, endIndex);
    }, [sortedOrders, page])

    const deletedOrder = async(orderId) => {
        try{
            const confirmDelete = confirm("Delete this order?");
            if(!confirmDelete) return;
            await deleteDoc(doc(db, "orders",orderId));
        }catch(error){
            console.error("Error deleting order: ", error);
        }
    }

    const totalPages = Math.ceil(sortedOrders.length / limit);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db,"orders"),(snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setOrders(ordersData);
            setLoading(false);
        })
        return () => unsubscribe(); 
    })


    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, sortBy, sortOrder])

    if(loading){
        return <p>Loading Orders...</p>
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Orders page</h1>
            <OrdersStats orders={orders} />
            {/* <OrdersStats orders={filteredOrders} /> */}
            <OrdersToolbar
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setPage={setPage}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
            />
            <p className={styles.resultCount}>
                Showing {paginatedOrders.length} of {filteredOrders.length} orders
            </p>

            {filteredOrders.length === 0 ? (
                <p className={styles.emptyState}>
                    🔍 No orders found
                </p>
            ) :
                <OrdersTable orders={paginatedOrders} deletedOrder={deletedOrder} search={search} />
            }

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    )
}