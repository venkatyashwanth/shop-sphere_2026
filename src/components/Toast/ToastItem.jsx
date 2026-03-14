import { useDispatch } from "react-redux";
import styles from "./Toast.module.scss";
import { useEffect } from "react";
import { removeToast } from "@/features/toast/toastSlice";
export default function ToastItem({ toast }) {
    const dispatch = useDispatch();
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeToast(toast.id));
        }, 2500)
        return () => clearTimeout(timer);
    }, [dispatch, toast.id])
    return (
        <div className={styles.toastItem}>
            {toast.message}
        </div>
    )
}