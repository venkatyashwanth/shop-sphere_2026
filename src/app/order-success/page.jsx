import Link from "next/link";
import styles from "./page.module.scss";
export default function OrderSuccessPage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1>🎉 Order Placed Successfully!</h1>
                <p>
                    Thank you for shopping with us.
                    Your order has been placed.
                </p>
                <div className={styles.actions}>
                    <Link href="/">
                        <button className={styles.primary}>
                            View My Orders
                        </button>
                    </Link>
                    <Link href="/">
                        <button className={styles.secondary}>
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}