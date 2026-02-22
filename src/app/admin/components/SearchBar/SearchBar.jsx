import styles from "./SearchBar.module.scss";

export default function SearchBar({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.searchInput} />
        </div>
    )
}