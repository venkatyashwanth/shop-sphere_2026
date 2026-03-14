import styles from "./Pagination.module.scss";

export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>

      <button
        onClick={() => setPage(p => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
      >
        Next
      </button>

    </div>
  );
}