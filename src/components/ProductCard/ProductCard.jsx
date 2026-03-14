import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartslice";
import { addToast} from "@/features/toast/toastSlice";
import styles from "./ProductCard.module.scss";

export default function ProductCard({ product }) {
    const { image, title, category, price } = product;
    const dispatch = useDispatch();
    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart(product));
        dispatch(addToast("Item added to cart 🥳"));
    }
    return (
        <Link href={`/product/${product.id}`} className={styles.Link}>
            <div className={styles.card}>
                <div className={styles.image} style={{ backgroundImage: `url(${image})` }}></div>
                <div className={styles.info}>
                    <div>
                        <h3>{title}</h3>
                        <p className={styles.category}>{category}</p>
                        <p className={styles.price}>₹{price}</p>
                    </div>
                    <div className={styles.actionRow}>
                        <button className={styles.button} onClick={e => handleAddToCart(e)}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </Link>

    )
}