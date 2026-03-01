import styles from "./PriceRangeSlider.module.scss";
export default function PriceRangeSlider({
    minPrice,
    maxPrice,
    range,
    setRange
}) {
    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value <= range[1]) {
            setRange([value, range[1]])
        }
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value >= range[0]) {
            setRange([range[0], value])
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.slider}>
                <input
                    className={styles.inputRange}
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={range[0]}
                    onChange={handleMinChange}
                />
                <input
                    className={styles.inputRange}
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={range[1]}
                    onChange={handleMaxChange}
                />
            </div>
            <div className={styles.values}>
                <span>₹ {range[0]}</span>
                <span>₹ {range[1]}</span>
            </div>
        </div>
    )
}