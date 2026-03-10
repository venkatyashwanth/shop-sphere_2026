import { useEffect, useState } from "react";
import styles from "./OrdersToolbar.module.scss";
export default function OrdersToolbar({
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    setPage,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
}) {
    const [localSearch, setLocalSearch] = useState(search);
    useEffect(() => {

        const timer = setTimeout(() => {
            setSearch(localSearch);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);

    }, [localSearch, setSearch, setPage]);

    const handleFilter = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    }

    return (
        <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search order or user"
                    className={styles.searchInput}
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                />
            </div>
            <div className={styles.filterWrapper}>
                <select
                    className={styles.filterSelect}
                    value={statusFilter}
                    onChange={handleFilter}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select
                    className={styles.filterSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="date">Sort by Date</option>
                    <option value="price">Sort by Price</option>
                    <option value="status">Sort by Status</option>
                </select>
                <button
                    className={styles.sortBtn}
                    onClick={() =>
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                >
                    {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
                </button>
            </div>
        </div>
    )
}