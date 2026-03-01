import { useEffect, useRef, useState } from "react";
import styles from "./MobileSearchOverlay.module.scss";
import { useRouter } from "next/navigation";
export default function MobileSearchOverlay({
    open,
    onClose,
    searchTerm,
    setSearchTerm,
    results = []
}) {
    const inputRef = useRef(null);
    const router = useRouter();
    const STORAGE_KEY = "shopsphere_recent_searches";
    const [recentSearches, setRecentSearches] = useState([]);


    const previewResults = results.slice(0, 5);
    const highlight = (text) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, "gi");
        return text.split(regex).map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
                <mark key={i}>{part}</mark>
            ) : (
                part
            )
        );
    };
    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
            document.body.style.overflow = "hidden";
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        }
        return () => {
            document.body.style.overflow = "auto";
        }
    }, [open])
    if (!open) return null;
    return (
        <div className={styles.overlay}>
            <div className={styles.backdrop} onClick={onClose} />
            <div className={styles.panel}>
                <div className={styles.inputWrapper}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && searchTerm.trim()) {
                                const updated = [
                                    searchTerm,
                                    ...recentSearches.filter(s => s !== searchTerm)
                                ].slice(0, 5);
                                setRecentSearches(updated);
                                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                                onClose();
                            }
                        }}
                    />
                    {
                        searchTerm && (
                            <button
                                className={styles.clearBtn}
                                onClick={() => setSearchTerm("")}
                            >
                                ✕
                            </button>
                        )
                    }
                </div>
                {/* Live Results */}
                {searchTerm ? (
                    <div className={styles.results}>
                        {previewResults.length > 0 ?
                            (
                                previewResults.map((item) => (
                                    <div
                                        key={item.id}
                                        className={styles.resultItem}
                                        onClick={() => {
                                            router.push(`/product/${item.id}`);
                                            const updated = [
                                                searchTerm,
                                                ...recentSearches.filter(s => s !== searchTerm)
                                            ].slice(0, 5);
                                            setRecentSearches(updated);
                                            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                                            onClose();
                                        }}
                                    >
                                        <div className={styles.thumb}>
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                        <div
                                            className={styles.resultInfo}
                                        >
                                            <div className={styles.resultTitle}>
                                                {highlight(item.title)}
                                            </div>
                                            <div className={styles.resultPrice}>
                                                ₹ {item.price}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    No results found
                                </div>
                            )}
                    </div>
                ) : (
                    recentSearches.length > 0 && (
                        <div className={styles.recentSection}>
                            <div className={styles.recentHeader}>
                                <span>Recent Searches</span>
                                <button
                                    onClick={() => {
                                        setRecentSearches([]);
                                        localStorage.removeItem(STORAGE_KEY);
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                            {recentSearches.map((term, i) => (
                                <div
                                    key={i}
                                    className={styles.recentItem}
                                    onClick={() => {
                                        setSearchTerm(term);
                                    }}
                                >
                                    🔁 {term}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}