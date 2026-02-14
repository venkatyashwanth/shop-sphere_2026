"use client";

import { useSelector } from "react-redux";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Header() {
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true) }, [])
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <Link href="/" className={styles.logo}>ShopSphere</Link>
                    <nav className={styles.nav}>
                        <Link href="/login">Login</Link>
                        <Link href="/cart" className={styles.cart}>
                            🛒
                            {isMounted && totalQuantity > 0 && (
                                <span className={styles.badge}>{totalQuantity}</span>
                            )}
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}