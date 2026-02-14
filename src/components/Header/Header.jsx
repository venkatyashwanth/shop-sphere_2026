import styles from "./Header.module.scss";
import Link from "next/link";
export default function Header() {
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <Link href="/" className={styles.logo}>ShopSphere</Link>
                    <nav className={styles.nav}>
                        <Link href="/login">Login</Link>
                        <Link href="/cart">Cart</Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}