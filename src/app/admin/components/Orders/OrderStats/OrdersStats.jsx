import styles from "./OrderStats.module.scss";
export default function OrdersStats({ orders }) {
    const totalOrders = orders.length;
    // const pending = orders.filter(o => o.status === "Pending").length;
    // const cancelled = orders.filter(o => o.status === "Cancelled").length;
    const stats = orders.reduce(
        (acc, order) => {
            acc.total++;

            if (order.status === "Pending") acc.pending++;
            if (order.status === "Cancelled") acc.cancelled++;

            return acc;
        },
        { total: 0, pending: 0, cancelled: 0 }
    );


    return (
        <div className={styles.statsContainer}>
            <div className={styles.statCard}>
                <p>Total Orders</p>
                <p>{totalOrders}</p>
            </div>
            <div className={styles.statCard}>
                <p>Pending</p>
                <p>{stats.pending}</p>
            </div>

            <div className={styles.statCard}>
                <p>Cancelled</p>
                <p>{stats.cancelled}</p>
            </div>
        </div>
    )
}