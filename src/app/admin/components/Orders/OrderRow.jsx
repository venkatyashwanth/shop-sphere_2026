import { highlightText } from "../../utils/highlightText";
import styles from "./OrdersTable.module.scss";
import StatusBadge from "./StatusBadge/StatusBadge";


export default function OrderRow({ order, deletedOrder, search }) {
    // const handleDelete = () => {
    //     setOrders((prev) => prev.filter((o) => o.id !== order.id));
    // }
    // console.log(order);
    return (
        <tr>
            <td className={styles.orderId}>
                {highlightText(order.id, search)}
                {/* {order.id} */}
            </td>

            <td>
                {highlightText(order.userEmail,search)}    
                {/* {order.user.email} */}
            </td>

            <td>
                {highlightText(order.items[0].title,search)}
                {/* {order.items[0].title} */}
            </td>

            <td>{order.items[0].category}</td>

            <td>
                <StatusBadge status={order.status} />
            </td>
            <td>
                {order.status === "Cancelled" ? (
                    <button onClick={() => deletedOrder(order.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                        Delete
                    </button>
                ) : (
                    <button className={`${styles.actionBtn} ${styles.viewBtn}`}>View</button>
                )}
            </td>
        </tr>
    )
}