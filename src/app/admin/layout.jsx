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

    const isActive = (path) => {
        if(path === "/admin"){
            return pathname === "/admin";
        }
        return pathname.startsWith(path)
    }

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
                <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.logo}>Admin</h2>
                        <button className={styles.closeBtn}
                            onClick={() => setOpen(false)}
                        > ✕</button>
                    </div>
                    <nav className={styles.nav}>
                        <Link href="/admin" className={isActive("/admin")? styles.active: ""} onClick={() => setOpen(false)}> Dashboard</Link>
                        <Link href="/admin/products" className={isActive("/admin/products")? styles.active: ""} onClick={() => setOpen(false)}>Products</Link>
                        <Link href="/admin/orders" className={isActive("/admin/orders")? styles.active: ""} onClick={() => setOpen(false)}>Orders</Link>
                        <Link href="/" onClick={() => setOpen(false)}>← Back to Store</Link>
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