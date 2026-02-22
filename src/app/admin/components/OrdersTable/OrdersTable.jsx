import StatusDropdown from "../StatusDropdown/StatusDropdown";
import styles from "./OrdersTable.module.scss";

function SortableHeader({
    label, sortKey, sortConfig, onSort
}) {
    const isActive = sortConfig.key === sortKey;
    const isAsc = isActive && sortConfig.direction === "asc";
    return (
        <th
            onClick={() => onSort(sortKey)}
            className={styles.sortable}
        >
            <span>{label}</span>
            <span
                className={`${styles.sortIcon} ${isActive ? styles.activeSort : ""
                    } ${isAsc ? styles.rotate : ""}`}
            >
                ▼
            </span>
        </th>
    )
}


export default function OrdersTable({
    debouncedSearch,
    orders,
    onSelect,
    onStatusChange,
    sortConfig,
    onSort,
    highlightText
}) {
    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <SortableHeader
                            label="Order ID"
                            sortKey="id"
                            sortConfig={sortConfig}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="User"
                            sortKey="userEmail"
                            sortConfig={sortConfig}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Total"
                            sortKey="totalPrice"
                            sortConfig={sortConfig}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Status"
                            sortKey="status"
                            sortConfig={sortConfig}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Date"
                            sortKey="createdAt"
                            sortConfig={sortConfig}
                            onSort={onSort}
                        />
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            onClick={() => onSelect(order)}
                            className={styles.clickableRow}
                        >
                            <td>
                                {console.log(order._search)}
                                {highlightText(order.id.slice(0, 6) + "...", debouncedSearch)}
                            </td>
                            <td>
                                {order.userEmail ? highlightText(order.userEmail, debouncedSearch) : "—"}
                            </td>
                            <td>
                                ₹ {order.totalPrice}
                            </td>
                            <td>
                                <StatusDropdown
                                    order={order}
                                    onStatusChange={onStatusChange}
                                />
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
        </>
    )
}