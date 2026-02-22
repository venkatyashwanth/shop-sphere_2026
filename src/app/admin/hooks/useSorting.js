"use client";

import { useMemo, useState } from "react";

export function useSorting(data, initialConfig = {
    key: "createdAt",
    direction: "desc",
}) {
    const [sortConfig, setSortConfig] = useState(initialConfig);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
        }));
    };

    const sortedData = useMemo(() => {
        const sorted = [...data].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === "createdAt") {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue?.toLowerCase();
            }

            if (aValue < bValue)
                return sortConfig.direction === "asc" ? -1 : 1;

            if (aValue > bValue)
                return sortConfig.direction === "asc" ? 1 : -1;

            return 0;
        });

        return sorted;
    }, [data, sortConfig]);

    return {
        sortConfig,
        handleSort,
        sortedData
    }
}