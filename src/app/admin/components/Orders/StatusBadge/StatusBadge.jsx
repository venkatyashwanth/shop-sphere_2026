import styles from "./StatusBadge.module.scss";
export default function StatusBadge({ status }) {

    const statusClass = {
        Pending: styles.pending,
        Shipped: styles.shipped,
        Delivered: styles.delivered,
        Cancelled: styles.cancelled
    };

    return (
        <span className={`${styles.badge} ${statusClass[status]}`}>
            {status}
        </span>
    );
}