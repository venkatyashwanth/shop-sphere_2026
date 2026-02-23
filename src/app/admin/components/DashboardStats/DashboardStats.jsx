"use client";

import styles from "./DashboardStats.module.scss";

function StatCard({icon,value,label}){
    return(
        <div className={styles.statCard}>
            <span  className={styles.statIcon}>{icon}</span>
            <div >
                <h3>{value}</h3>
                <p>{label}</p>
            </div>
        </div>
    )
}

export default function DashboardStats({stats}){
    return (
        <div className={styles.statsGrid}>
            <StatCard icon="🧾" value={stats.orders} label="Total Orders"/>
            <StatCard icon="💰" value={`₹ ${stats.revenue}`} label="Total Revenue"/>
            <StatCard icon="👥" value={stats.users} label="Total Users"/>
            <StatCard icon="📦" value={stats.products} label="Total Products"/>
        </div>
    )
}