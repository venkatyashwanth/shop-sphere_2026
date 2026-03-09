"use client";
import { IoCart } from "react-icons/io5";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useSelector } from "react-redux";
import styles from "./Header.module.scss";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTheme } from "@/app/hooks/useTheme";

export default function Header() {
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);
    const menuRef = useRef(null);
    const { theme, setTheme } = useTheme();

    useEffect(() => { setIsMounted(true) }, [])

    useEffect(() => {
        function handleClickoutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickoutside);
        return () => document.removeEventListener("mousedown", handleClickoutside);
    }, [])

    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => { document.removeEventListener("keydown", handleKeyDown) }
    }, [open])

    // Keyboard Navigation
    useEffect(() => {
        if (!open) return;
        const menu = menuRef.current;
        if (!menu) return;

        const focusable = menu.querySelectorAll('[role="menuitem"]');
        if (!focusable.length) return;

        let index = 0;
        focusable[index].focus();
        function handleKeyDown(e) {
            if (!open) return;
            if (e.key === "Escape") {
                e.preventDefault();
                console.log("click");

                setOpen(false);
                avatarRef.current?.focus();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                index = (index + 1) % focusable.length;
                focusable[index].focus();
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                index = (index - 1 + focusable.length) % focusable.length;
                focusable[index].focus();
                return;
            }
            if (e.key === "Tab") {
                e.preventDefault();
                index = e.shiftKey ? (index - 1 + focusable.length) % focusable.length : (index + 1) % focusable.length;
                focusable[index].focus();
            }
        }

        menu.addEventListener("keydown", handleKeyDown);
        return () => { menu.removeEventListener("keydown", handleKeyDown) }
    }, [open])

    const handleLogout = async () => {
        await signOut(auth);
        setOpen(false);
    }

    if (authLoading) {
        return (
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.skeletonNav}>
                        <div className={styles.skeletonLogo}></div>
                        <div className={styles.skeletonLinks}>
                            <div className={styles.skeletonLink}></div>
                            <div className={styles.skeletonLink}></div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <Link href="/" className={styles.logo}>ShopSphere</Link>
                    <nav className={styles.nav}>
                        {user ? (
                            <div
                                className={styles.userMenu}
                                ref={dropdownRef}
                            >
                                <div className={styles.avatarWrapper}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <button
                                            ref={avatarRef}
                                            onClick={() => setOpen(prev => !prev)}
                                            className={styles.avatarBtn}
                                            aria-haspopup="menu"
                                            aria-label="User menu"
                                            aria-expanded={open}
                                            aria-controls="user-menu"
                                        >
                                            {user?.photoURL ? (
                                                <img 
                                                    src={user.photoURL}
                                                    alt={user.name}
                                                    className={styles.avatarImg}/>
                                            ) :
                                                <span className={styles.avatarLetter}>
                                                    {user.email?.charAt(0).toUpperCase()}
                                                    {console.log(user.name)}
                                                </span>
                                            }

                                            <span className={`${styles.dropdownArrow} ${open ? styles.rotateArrow : ""}`}>
                                                🔻
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {open && (
                                    <div
                                        id="user-menu"
                                        ref={menuRef}
                                        className={styles.dropdown}
                                        role="menu"
                                    >
                                        <span className={styles.userEmail}>
                                            {user.email}
                                        </span>
                                        <ul className={styles.menuList}>
                                            <li>
                                                <Link href="/orders" role="menuitem" onClick={() => setOpen(false)}>
                                                    My Orders
                                                </Link>
                                            </li>
                                            {user?.role === "admin" && (
                                                <li>
                                                    <Link href="/admin" role="menuitem" onClick={() => setOpen(false)}>
                                                        Admin
                                                    </Link>
                                                </li>
                                            )}
                                            <li>
                                                <button role="menuitem" onClick={handleLogout} className={styles.logout}>
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                            </div>
                        ) : (
                            <Link href="/login">Login</Link>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    role="switch"
                                    aria-label="Toggle dark mode"
                                    checked={theme === "dark"}
                                    onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <Link href="/cart" className={styles.cart}>
                            <IoCart className={styles.icon} />
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