import styles from "./HeroSection.module.scss";
export default function HeroSection() {
    return (
        <div className={styles.hero}>
            <h1>Discover Your Next Favorite Product</h1>
            <p>Premium quality. Minimal design. Fast delivery.</p>
        </div>
    )
}