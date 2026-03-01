import styles from "./CategoryPills.module.scss";
export default function CategoryPills({
    categories,
    activeCategory,
    setActiveCategory
}) {
    
    return (
        <div className={styles.wrapper}>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => {setActiveCategory(cat)}}
                    className={`${styles.pill} ${activeCategory === cat ? styles.active : ""}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}