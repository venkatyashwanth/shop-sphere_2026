import styles from "./Pagination.module.scss";

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages });

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >←</button>
            {pages.map((_, index) => {
                const page = index + 1;
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={page === currentPage ? styles.active : ""}
                    >
                        {page}
                    </button>
                )
            })}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >→</button>
        </div>
    )
}
