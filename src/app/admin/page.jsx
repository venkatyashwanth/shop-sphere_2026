"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./admin.module.scss";
import OrderDrawer from "./components/OrderDrawer/OrderDrawer";
import OrdersTable from "./components/OrdersTable/OrdersTable";
import FilterBar from "./components/FilterBar/FilterBar";
import SearchBar from "./components/SearchBar/SearchBar";
import { useSorting } from "./hooks/useSorting";
import { useOrderFilters } from "./hooks/useOrderFilters";
import { useDashboardData } from "./hooks/useDashboardData";
import { highlightText } from "./utils/highlightText";
import DashboardStats from "./components/DashboardStats/DashboardStats";
import { usePagination } from "./hooks/usePagination";
import Pagination from "./components/Pagination/Pagination";
import RevenueAnalytics from "./components/RevenueAnalytics/RevenueAnalytics";
import Toast from "./components/ui/Toast/Toast";

const FILTER_OPTIONS = [
    "All",
    "Placed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
];
export default function AdminPage() {
    const user = useSelector(state => state.auth.user);
    const router = useRouter();
    const { orders, setOrders, stats, selectedOrder, setSelectedOrder, loading, updatedIds, toastMessage, setToastMessage } = useDashboardData();
    const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredOrders, debouncedSearch } = useOrderFilters(orders);
    const { sortConfig, handleSort, sortedData: sortedOrders } = useSorting(filteredOrders);
    const { currentPage, totalPages, paginatedData, goToPage, startIndex, endIndex, totalItems } = usePagination(sortedOrders, 8);
    
    const handleOptimisticUpdate = (orderId, newStatus) =>
        setOrders((prev) =>
            prev.map((o) =>
                o.id === orderId ? { ...o, status: newStatus } : o
            )
        )

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/")
        }
    }, [user, router])

    if (!user || user.role !== "admin") return null;

    return (
        <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <DashboardStats stats={stats} loading={loading} />
            <RevenueAnalytics orders={orders}/>
            <div className={styles.recentSection}>
                <h2>Recent Orders</h2>
                <div className={styles.tableWrapper}>
                    <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by Order ID or Email..." />
                    <FilterBar
                        options={FILTER_OPTIONS}
                        activeFilter={statusFilter}
                        onChange={setStatusFilter}
                    />
                    <OrdersTable
                        debouncedSearch={debouncedSearch}
                        orders={paginatedData}
                        onSelect={setSelectedOrder}
                        onStatusChange={handleOptimisticUpdate}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                        highlightText={highlightText}
                        loading={loading}
                        updatedIds={updatedIds}
                    />
                    <div className={styles.paginationInfo}>
                        Showing {startIndex}–{endIndex} of {totalItems} orders
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                    <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                    <Toast
                        message={toastMessage}
                        visible={!!toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                </div>
            </div>
        </div>
    )
}