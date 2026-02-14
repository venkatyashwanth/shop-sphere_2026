import styles from "./ProductCard.module.scss";

export default function ProductCard() {
    return (
        <div className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.info}>
                <h3>iPhone 15 Pro</h3>
                <p className={styles.category}>Smartphones</p>
                <p className={styles.price}>₹1,29,900</p>
            </div>
        </div>
    )
}