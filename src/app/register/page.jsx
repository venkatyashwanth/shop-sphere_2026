"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db,"users",userCredential.user.uid),{
                emal: userCredential.user.email,
                role: "user",
                createdAt: new Date().toISOString()
            })
            router.push("/");   
        } catch (err) {
            setError("Could not create account");
        }
        setLoading(false);
    }

    useEffect(() => {
        if(!authLoading && user){
            router.replace("/");
        }
    },[user,authLoading,router])

    if(authLoading) return null;

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleRegister}>
                <h1>Create Account</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} required />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Register"}
                </button>
                <div className={styles.redirect}>
                    <span>Already have an account? </span>
                    <Link href="/login">Login</Link>
                </div>
            </form>
        </div>
    )
}