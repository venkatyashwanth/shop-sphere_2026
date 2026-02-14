import styles from "./page.module.scss";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export default function Home() {  
  return (
    <div className={styles.base}>
      <ProductGrid />
    </div>
  );
}
