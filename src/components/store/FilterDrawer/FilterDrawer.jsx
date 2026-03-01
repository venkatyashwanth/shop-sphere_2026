import { useEffect } from "react";
import styles from "./FilterDrawer.module.scss";

export default function FilterDrawer({
    open,
    onClose,
    children
}) {
    useEffect(() => {
        if(!open) return;
        const handleEsc = (e) => {
            if(e.key === "Escape") onClose();
        }
        document.addEventListener("keydown",handleEsc);
        document.body.style.overflow = "hidden";

        return() => {
            document.removeEventListener("keydown",handleEsc);
            document.body.style.overflow = "auto"
        }
    },[open,onClose])

    return (
        <>
            <div onClick={onClose} className={`${styles.backdrop} ${open? styles.showBackdrop: ""}`}>
                <div className={`${styles.drawer} ${open? styles.open: ""}`}>
                    <div className={styles.header}>
                        <h3>Filters</h3>
                        <button>✕</button>
                    </div>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}