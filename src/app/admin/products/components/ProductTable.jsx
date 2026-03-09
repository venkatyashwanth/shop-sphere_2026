import styles from './ProductTable.module.scss';
export default function ProductTable({
    products,
    onEdit,
    onDelete,
    highlightId,
    onToggleActive,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    bulkUpdateStatus
}) {
    return (
        <div className={styles.wrapper}>
            {selectedIds.length > 0 && (
                <div className={styles.bulkActions}>
                    <span>{selectedIds.length} selected</span>
                    <button
                        onClick={() => bulkUpdateStatus(true)}
                    >
                        Activate
                    </button>
                    <button
                        onClick={() => bulkUpdateStatus(false)}
                    >
                        Deactivate
                    </button>
                </div>
            )}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                        <th>Status</th>
                        <th>
                            <input
                                type="checkbox"
                                onChange={toggleSelectAll}
                                checked={
                                    products.length > 0 &&
                                    products.every(p =>
                                        selectedIds.includes(p.id)
                                    )
                                }
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}
                            className={`
                                  ${styles.tableRow}
                                  ${highlightId === product.id ? styles.rowHighlight : ""}
                                  ${product.active === false ? styles.inactiveRow : ""}
                                `}
                        >
                            <td>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                />
                            </td>
                            <td>
                                <div className={styles.titleCell}>
                                    {product.title}
                                    {product.active === false && (
                                        <span className={styles.inactiveBadge}>
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>₹ {product.price}</td>
                            <td>{product.category}</td>
                            <td className={styles.actions}>
                                <button
                                    className={styles.edit}
                                    onClick={() => onEdit(product)}
                                >
                                    Edit
                                </button>

                                <button
                                    className={styles.delete}
                                    onClick={() =>
                                        onDelete(product.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                            <td>
                                <label className={styles.switch}>
                                    <input
                                        type="checkbox"
                                        checked={product.active ?? true}
                                        onChange={() => onToggleActive(product)}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </td>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedIds.includes(product.id)}
                                    onChange={() => toggleSelect(product.id)}
                                    />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}