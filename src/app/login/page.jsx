"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading,setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            await signInWithEmailAndPassword(auth,email,password);
            router.replace(redirect);
        } 
        catch(err){
            console.error("Login Error: ",err);
            setError(err.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        if(!authLoading && user){
            router.replace("/");
        }
    },[user,authLoading,router])

    if (authLoading) return null;
    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
                <h1>Login</h1>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading? "Signing in..." : "Login"}
                </button>

                <div className={styles.redirect}>
                    <span>Don't have an account?</span>
                    <Link href="/register">Create One</Link>
                </div>
            </form>
        </div>
    )
}