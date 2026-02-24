"use client";
import AnimatedCounter from "../ui/AnimatedCounter/AnimatedCounter";
import Skeleton from "../ui/Skeleton/Skeleton";
import styles from "./DashboardStats.module.scss";

function StatCard({ icon, value, label, isCurrency }) {
    return (
        <div className={styles.statCard}>
            <span className={styles.statIcon}>{icon}</span>
            <div >
                <h3>
                    {isCurrency ? (
                        <AnimatedCounter
                            value={value}
                            prefix="₹ "
                            duration={1200}
                        />
                    ) : (
                        <AnimatedCounter
                            value={value}
                            duration={1200}
                        />
                    )}
                </h3>
                <p>{label}</p>
            </div>
        </div>
    )
}

export default function DashboardStats({ stats, loading }) {
    if (loading) {
        return (
            <div className={styles.statsGrid}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles.statCard}>
                        <Skeleton width="24px" height="24px" radius="50%" />
                        <div className={styles.skltn}>
                            <Skeleton width="60px" height="18px" />
                            <Skeleton width="90px" height="14px" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    return (
        <div className={styles.statsGrid}>
            <StatCard icon="🧾" value={stats.orders} label="Total Orders" />
            <StatCard icon="💰" value={stats.revenue} label="Total Revenue" isCurrency/>
            <StatCard icon="👥" value={stats.users} label="Total Users" />
            <StatCard icon="📦" value={stats.products} label="Total Products" />
        </div>
    )
}