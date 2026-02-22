import { useEffect, useRef, useState } from "react";
import styles from "./StatusDropdown.module.scss";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StatusDropdown({ order, onStatusChange }) {
    const STATUS_OPTIONS = [
        "Placed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];
    const wrapperRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (newStatus) => {
        try {
            setUpdating(true);
            onStatusChange(order.id, newStatus);
            await updateDoc(doc(db, "orders", order.id), {
                status: newStatus
            })
            setOpen(false);
        } catch (error) {
            console.error("status update failed: ", error);
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!wrapperRef.current?.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [])


    return (
        <div className={styles.wrapper} ref={wrapperRef} onClick={(e) => e.stopPropagation()}>
            <button
                disabled={updating}
                className={`${styles.statusBadge} ${styles[`status_${(order.status || "placed").toLowerCase()}`]}`}
                onClick={() => setOpen(prev => !prev)}
            >
                {updating && (
                    <span className={styles.spinner}></span>
                )}
                <span className={updating ? styles.hiddenText : ""}>
                    {order.status || "Placed"}
                </span>
            </button>
            {open && (
                <div className={styles.dropdown}>
                    {STATUS_OPTIONS.map((status) => (
                        <button key={status}
                            onClick={() => handleStatusChange(status)}
                        >{status}</button>
                    ))}
                </div>
            )}
        </div>
    )
}