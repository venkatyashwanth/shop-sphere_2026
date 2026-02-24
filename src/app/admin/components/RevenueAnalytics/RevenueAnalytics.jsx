import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Area,
    AreaChart,
} from "recharts";
import styles from "./RevenueAnalytics.module.scss";
import { useState } from "react";
import Skeleton from "../ui/Skeleton/Skeleton";
export default function RevenueAnalytics({ orders }) {
    const [range, setRange] = useState("30days");
    const [chartType, setChartType] = useState("line");
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const { chartData, comparison } = useMemo(() => {
        const revenueMap = {};
        const now = new Date();

        orders.forEach((order) => {
            if (!order.createdAt) return;

            const dateObj = new Date(order.createdAt);

            // Filter last 30 days
            if (range === "30days") {
                const diff =
                    (now - dateObj) / (1000 * 60 * 60 * 24);
                if (diff > 30) return;
            }

            const key =
                range === "monthly"
                    ? `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`
                    : dateObj.toISOString().split("T")[0];

            revenueMap[key] =
                (revenueMap[key] || 0) +
                (order.totalPrice || 0);
        });

        const sorted = Object.entries(revenueMap)
            .map(([date, revenue]) => ({
                date,
                revenue,
            }))
            .sort((a, b) =>
                new Date(a.date) - new Date(b.date)
            );

        // Revenue comparison (this week vs last week)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        let thisWeek = 0;
        let lastWeek = 0;

        orders.forEach((order) => {
            if (!order.createdAt) return;
            const d = new Date(order.createdAt);

            if (d >= weekAgo) thisWeek += order.totalPrice || 0;
            else if (d >= twoWeeksAgo && d < weekAgo)
                lastWeek += order.totalPrice || 0;
        });

        const growth =
            lastWeek === 0
                ? 100
                : ((thisWeek - lastWeek) / lastWeek) * 100;

        return {
            chartData: sorted,
            comparison: {
                thisWeek,
                lastWeek,
                growth: growth.toFixed(1),
            },
        };
    }, [orders, range]);

    if (!chartData.length) {
        return (
            <div className={styles.card}>
                <Skeleton height="24px" width="150px" mb="10px"/>
                <Skeleton height="300px" />
            </div>
        );
    }
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3>Revenue Analytics</h3>
                <div className={styles.controls}>
                    <button
                        onClick={() => setRange("30days")}
                        className={
                            range === "30days"
                                ? styles.active
                                : ""
                        }
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setRange("monthly")}
                        className={
                            range === "monthly"
                                ? styles.active
                                : ""
                        }
                    >
                        Monthly
                    </button>

                    <button
                        onClick={() =>
                            setChartType(
                                chartType === "line" ? "bar" : "line"
                            )
                        }
                    >
                        {chartType === "line"
                            ? "Bar"
                            : "Line"}
                    </button>
                </div>
            </div>
            <div className={styles.comparison}>
                <span>
                    This Week: ₹{comparison.thisWeek}
                </span>
                <span>
                    Growth:{" "}
                    <strong
                        className={
                            comparison.growth >= 0
                                ? styles.positive
                                : styles.negative
                        }
                    >
                        {comparison.growth}%
                    </strong>
                </span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
                {chartType === "line" ? (
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#000"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#000"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? "#333" : "#eee"}
                        />

                        <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke={isDark ? "#aaa" : "#666"} />
                        <YAxis tick={{ fontSize: 11 }} stroke={isDark ? "#aaa" : "#666"} />

                        <Tooltip
                            formatter={(value) => `₹${value}`}
                        />

                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#000"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            animationDuration={800}
                        />
                    </AreaChart>
                ) : (
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke={isDark ? "#aaa" : "#666"} />
                        <YAxis tick={{ fontSize: 11 }} stroke={isDark ? "#aaa" : "#666"} />
                        <Tooltip />
                        <Bar
                            dataKey="revenue"
                            fill="#000"
                            radius={[6, 6, 0, 0]}
                            animationDuration={800}
                        />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    )
}