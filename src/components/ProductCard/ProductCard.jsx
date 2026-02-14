import { useDispatch } from "react-redux";
import styles from "./ProductCard.module.scss";
import { addToCart } from "@/features/cart/cartslice";
import Link from "next/link";

export default function ProductCard({ product }) {
    const { image, title, category, price } = product;
    const dispatch = useDispatch();
    return (
        <Link href={`/product/${product.id}`} className={styles.Link}>
            <div className={styles.card}>
                <div className={styles.image} style={{ backgroundImage: `url(${image})` }}></div>
                <div className={styles.info}>
                    <h3>{title}</h3>
                    <p className={styles.category}>{category}</p>
                    <p className={styles.price}>₹{price}</p>
                    <button className={styles.button} onClick={(e) => {e.preventDefault(); dispatch(addToCart(product))}}>Add to Cart</button>
                </div>
            </div>
        </Link>

    )
}