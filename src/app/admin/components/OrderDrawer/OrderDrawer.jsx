import { useEffect } from "react";
import styles from "./OrderDrawer.module.scss";

export default function OrderDrawer({ order, onClose }) {
    useEffect(() => {
        if(!order) return;
        const handleEsc = (e) => {
            if(e.key === "Escape"){
                onClose();
            }
        }
        document.addEventListener("keydown",handleEsc);
        return () => removeEventListener("keydown",handleEsc);
    },[order,onClose]);

    if(!order) return null;
    return (
        <>
            <div
                className={styles.backdrop}
                onClick={onClose}
            >
            </div>
            <div className={styles.drawer}>
                <button
                    className={styles.closeBtn}
                    onClick={onClose}
                >✕</button>
                <h2>Order Details</h2>
                <div className={styles.detailBlock}>
                    <strong>Order ID: </strong>
                    <p>{order.id}</p>
                </div>
                <div className={styles.detailBlock}>
                    <strong>User: </strong>
                    <p>{order.userEmail}</p>
                </div>
                <div className={styles.detailBlock}>
                    <strong>Status: </strong>
                    <p>{order.status}</p>
                </div>
                <div className={styles.detailBlock}>
                    <strong>Total: </strong>
                    <p>₹{order.totalPrice}</p>
                </div>
                <div className={styles.detailBlock}>
                    <strong>Address:</strong>
                    <p>{order.address?.street}</p>
                    <p>{order.address?.city}</p>
                </div>
                <div className={styles.itemsBlock}>
                    <strong>Items:</strong>
                    {order.items?.map((item) => (
                        <div key={item.id} className={styles.itemRow}>
                            <span>{item.title}</span>
                            <span>x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}