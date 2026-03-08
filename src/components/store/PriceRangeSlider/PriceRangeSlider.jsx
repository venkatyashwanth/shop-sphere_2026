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

    const left = ((range[0] - minPrice) / (maxPrice - minPrice)) * 100;
    const right = 100 - ((range[1] - minPrice) / (maxPrice - minPrice)) * 100;

    return (
        <div className={styles.wrapper}>
            <div className={styles.slider} tabIndex={0}>
                {/* Track */}
                <div className={styles.track}></div>

                {/* Selected range */}
                <div className={styles.progressWrap}>
                    <div
                        className={styles.progress}
                        style={{ left: `${left}%`, right: `${right}%` }}
                    ></div>
                </div>

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