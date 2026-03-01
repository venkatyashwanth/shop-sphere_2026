import Skeleton from "@/app/admin/components/ui/Skeleton/Skeleton";
import styles from "./StoreToolbar.module.scss";

export default function StoreToolbarSkeleton() {
    return (
        <div className={styles.toolbar}>
            {/* Search */}
            <Skeleton width="400px" height="40px" radius="10px" />
            {/* Sort */}
            <Skeleton width="400px" height="40px" radius="10px" />
            {/* Category pills */}
            <div className={styles.pillSkeletonRow}>
                {[...Array(4)].map((_, i) => (
                    <Skeleton
                        key={i}
                        width="80px"
                        height="32px"
                        radius="999px"
                    />
                ))}
            </div>
            {/* Price Slider */}
            <Skeleton width="200px" height="18px" radius="10px" />
        </div>
    )
}