"use client";
import Link from "next/link";
import styles from "./admin.module.scss";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (path) => {
        if (path === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(path)
    }

    useEffect(() => {
        const stored = localStorage.getItem("adminSidebarCollapsed");
        if (stored) {
            setCollapsed(stored === "true");
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("adminSidebarCollapsed", collapsed);
    }, [collapsed])


    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== "admin") {
                router.replace("/");
            }
        }
    }, [user, loading, router])

    useEffect(() => {
        function handleEscape(e) {
            if (e.key === "Escape") {
                setOpen(false);
            }
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    })

    if (loading) return null;
    if (!user || user.role !== "admin") return null;
    return (
        <>
            <div className={styles.adminWrapper}>
                {open && (
                    <div className={styles.overlay} onClick={() => setOpen(false)} />
                )}
                <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""} ${collapsed ? styles.collapsed : ""}`}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.logo}>{!collapsed && "Admin"}</h2>
                        <button
                            className={styles.collapseBtn}
                            onClick={() => setCollapsed(prev => !prev)}
                        >
                            {collapsed ? "»" : "«"}
                        </button>
                        <button className={styles.closeBtn}
                            onClick={() => setOpen(false)}
                        > ✕</button>
                    </div>
                    <nav className={styles.nav}>
                        <Link href="/admin" data-label="Dashboard" className={isActive("/admin") ? styles.active : ""} onClick={() => setOpen(false)}>
                            <span className={styles.icon}>📊</span>
                            <span className={styles.label}>Dashboard</span>
                        </Link>
                        <Link href="/admin/products" data-label="Products" className={isActive("/admin/products") ? styles.active : ""} onClick={() => setOpen(false)}>
                            <span className={styles.icon}>📦</span>
                            <span className={styles.label}>Products</span>
                        </Link>
                        <Link href="/admin/orders" data-label="Orders" className={isActive("/admin/orders") ? styles.active : ""} onClick={() => setOpen(false)}>
                            <span className={styles.icon}>🧾</span>
                            <span className={styles.label}>Orders</span>
                        </Link>
                        <Link href="/" data-label="Back to Store" onClick={() => setOpen(false)}>
                            <span className={styles.icon}>←</span>
                            <span className={styles.label}> Back to Store</span>
                        </Link>
                    </nav>
                </aside>
                <main className={styles.content}>
                    <button
                        className={styles.menuBtn}
                        onClick={() => setOpen(true)}
                    >
                        ☰
                    </button>
                    {children}
                </main>
            </div>
        </>
    )
}