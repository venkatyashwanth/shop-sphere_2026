import styles from "./ProductCardSkeleton.module.scss";

export default function ProductCardSkeleton(){
    return(
        <div className={styles.card}>
            <div className={styles.image}></div>
            <div className={styles.line}></div>
            <div className={`${styles.line} ${styles.small}`}></div>
            <div className={`${styles.line} ${styles.price}`}></div>
        </div>
    )
}