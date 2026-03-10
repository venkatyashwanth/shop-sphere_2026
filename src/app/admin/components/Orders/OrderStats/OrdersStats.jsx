import styles from "./OrderStats.module.scss";
export default function OrdersStats({ orders }) {
    const totalOrders = orders.length;
    const pending = orders.filter(o => o.status === "Pending").length;
    const cancelled = orders.filter(o => o.status === "Cancelled").length;

    return (
        <div className={styles.statsContainer}>
            <div className={styles.statCard}>
                <p>Total Orders</p>
                <p>{totalOrders}</p>
            </div>
            <div className={styles.statCard}>
                <p>Pending</p>
                <p>{pending}</p>
            </div>

            <div className={styles.statCard}>
                <p>Cancelled</p>
                <p>{cancelled}</p>
            </div>
        </div>
    )
}