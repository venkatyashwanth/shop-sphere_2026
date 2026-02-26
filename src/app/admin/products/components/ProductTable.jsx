import { useEffect } from 'react';
import styles from './ProductTable.module.scss';
export default function ProductTable({
    products,
    onEdit,
    onDelete,
    highlightId,
    onToggleActive
}) {
    useEffect(() => {
        console.log(highlightId);
    },[highlightId])
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}
                            className={
                                highlightId === product.id
                                ? styles.rowHighlight
                                : ""
                            }
                        >
                            <td>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                />
                            </td>
                            <td>{product.title}</td>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}