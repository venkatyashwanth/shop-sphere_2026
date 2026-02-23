"use client";

import { useEffect, useMemo, useState } from "react";

export function usePagination(data, itemsPerPage = 8) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = data.length;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };
    useEffect(() => {
        setCurrentPage(1)
    }, [data])

    const startIndex =
        totalItems === 0
            ? 0
            : (currentPage - 1) * itemsPerPage + 1;

    const endIndex = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    return {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
        // setCurrentPage,
        startIndex,
        endIndex,
        totalItems
    }
}