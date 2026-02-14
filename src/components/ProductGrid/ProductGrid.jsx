import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductGrid.module.scss";
export default function ProductGrid(){
    return(
        <div className={styles.grid}>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
            <ProductCard/>
        </div>
    )
}