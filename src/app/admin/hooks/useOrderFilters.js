"use client";

import { useEffect, useState } from "react";

export function useOrderFilters(orders) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const filteredOrders = useMemo(() => {
        return orders
            .filter((order) => {
                if (statusFilter === "All") return true;
                return (order.status || "Placed") === statusFilter;
            })
            .filter((order) => {
                if (!debouncedSearch) return true;

                const search = debouncedSearch.toLowerCase();

                return (
                    order.id.toLowerCase().includes(search) ||
                    order.userEmail?.toLowerCase().includes(search)
                );
            });
    }, [orders, statusFilter, debouncedSearch]);

    return {
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        filteredOrders,
        debouncedSearch
    }
}