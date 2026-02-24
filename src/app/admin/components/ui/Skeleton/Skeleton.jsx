"use client";
import styles from "./Skeleton.module.scss";

export default function Skeleton({
    width = "100%",
    height = "16px",
    radius = "8px",
    mb="0",
    className = ""
}) {
    return (
        <div className={`${styles.skeleton} ${className}`} style={{ width, height, borderRadius: radius,marginBottom: mb }} />
    )
}