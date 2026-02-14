import styles from "./ProductDetailsSkeleton.module.scss";

export default function ProductDetailsSkeleton(){
    return(
        <div className={styles.wrapper}>
            <div className={styles.image}></div>
            <div className={styles.info}>
                <div className={styles.title}></div>
                <div className={styles.category}></div>
                <div className={styles.price}></div>
                <div className={styles.description}></div>
                <div className={styles.button}></div>
            </div>
        </div>
    )
}