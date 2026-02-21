"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AdminPage() {
    const user = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role !== "admin") {
            router.replace("/")
        }
    }, [user, router])

    if (!user || user.role !== "admin") return null;

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    )
}