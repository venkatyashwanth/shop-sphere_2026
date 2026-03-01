import { useEffect, useRef, useState } from "react";
import styles from "./MobileFilterBar.module.scss";
export default function MobileFilterBar({
    activeFilterCount,
    onOpenFilters,
    onOpenSearch,
    onOpenSort
}) {
    const [visible,setVisible] = useState(true);
    const lastScrollY = useRef(0);
    useEffect(()=>{
        const handleScroll = () => {
            const currentY = window.scrollY;
            if(Math.abs(currentY - lastScrollY.current) < 8) return;
            if(currentY > lastScrollY.current && currentY > 100){
                setVisible(false);
            }else{
                setVisible(true);
            }
            lastScrollY.current = currentY;
        }
        
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    },[])
    return (
        <div className={`${styles.bar} ${visible? styles.show: styles.hide}`}>
            <button onClick={onOpenSearch}>
                🔎 <span>Search</span>
            </button>
            <button onClick={onOpenFilters}>
                ⚙ <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className={styles.badge}>
                        {activeFilterCount}
                    </span>
                )}
            </button>
            <button onClick={onOpenSort}>
                ↕ <span>Sort</span>
            </button>
        </div>
    )
}