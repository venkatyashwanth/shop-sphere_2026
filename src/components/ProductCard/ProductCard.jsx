import styles from "./ProductCard.module.scss";

export default function ProductCard({ product }) {
    const { image,title, category, price } = product;
    return (
        <div className={styles.card}>
            <div className={styles.image} style={{backgroundImage: `url(${image})`}}></div>
            <div className={styles.info}>
                <h3>{title} on staging</h3>
                <p className={styles.category}>{category}</p>
                <p className={styles.price}>₹{price}</p>
            </div>
        </div>
    )
}