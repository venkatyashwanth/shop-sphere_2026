import { useEffect, useRef, useState } from "react";
import styles from "./FilterDrawer.module.scss";

export default function FilterDrawer({
    open,
    onClose,
    children
}) {
    const drawerRef = useRef(null);
    const startY = useRef(0);
    const [translateY, setTranslateY] = useState(0);
    const [dragging, setDragging] = useState(false);

    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
        setDragging(true);
    }

    const handleTouchMove = (e) => {
        if (!dragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            setTranslateY(diff);
        }
    }

    const handleTouchEnd = () => {
        setDragging(false);
        if (translateY > 120) {
            triggerHaptic();
            onClose();
        } else {
            setTranslateY(0);
        }
    }

    const triggerHaptic = () => {
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(15);
        }
    }

    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "auto"
        }
    }, [open, onClose])

    useEffect(() => {
        if (!open) {
            setTranslateY(0);
            setDragging(false);
        }
    }, [open])

    return (
        <>
            <div onClick={() => { triggerHaptic(); onClose() }} className={`${styles.backdrop} ${open ? styles.showBackdrop : ""}`} />

            {/* </div> */}
            <div
                ref={drawerRef}
                className={`${styles.drawer} ${open ? styles.open : ""}`} style={{ transform: open ? `translateY(${translateY}px)` : `translateY(100%)`, transition: dragging ? "none" : "transform 0.3s ease" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className={styles.dragIndicator} />
                <div className={styles.header}>
                    <h3>Filters</h3>
                    <button onClick={() => { triggerHaptic(); onClose(); }}>✕</button>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </>
    )
}