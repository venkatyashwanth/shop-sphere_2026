import styles from "../admin.module.scss";
export const highlightText = (text, search) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <mark key={index} className={styles.highlight}>
                    {part}
                </mark>
            ) : (part)
        )
    }