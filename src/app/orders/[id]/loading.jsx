import Skeleton from "@/app/admin/components/ui/Skeleton/Skeleton";
import styles from './page.module.scss';

export default function Loading() {
    return (
        <div className={styles.wrapper}>
            <Skeleton width="200px" height="28px" />
            <Skeleton height="120px" />
            <Skeleton height="200px" />
        </div>
    )
}