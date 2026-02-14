import Image from "next/image";
import styles from "./page.module.scss";
import ProductCard from "@/components/ProductCard/ProductCard";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export default function Home() {
  return (
    <div className={styles.base}>
      <ProductGrid/>
    </div>
  );
}
