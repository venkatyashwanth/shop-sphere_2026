import styles from "./FilterBar.module.scss";

export default function FilterBar({
    options,
    activeFilter,
    onChange
}) {
    return (
        <div className={styles.filterBar}>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onChange(option)}
                    className={`${styles.filterBtn} ${activeFilter === option ? styles.activeFilter : ""}`}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}