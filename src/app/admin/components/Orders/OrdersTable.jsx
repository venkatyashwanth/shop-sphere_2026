import OrderRow from "./OrderRow";
import styles from "./OrdersTable.module.scss";
export default function OrdersTable({ orders, deletedOrder,search }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <OrderRow key={order.id} order={order} deletedOrder={deletedOrder} search={search} />
                    ))}
                </tbody>
            </table>
        </div>

    )
}