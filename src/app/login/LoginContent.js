"use client";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useSelector } from "react-redux";
import { validateLogin } from "@/lib/validators/authValidators";
import styles from "./page.module.scss";
import { doc, setDoc } from "firebase/firestore";

export default function LoginContent() {
    const authState = useSelector((state) => state.auth);
    const user = authState?.user;
    const authLoading = authState?.loading;
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const [touched, setTouched] = useState({})
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const registered = searchParams.get("registered");

    const validateField = (name, value) => {
        let message = "";
        if (name === "email") {
            if (!value) {
                message = "Email is required";
            }
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Enter a valid email address"
            }
        }

        if (name === "password") {
            if (!value) {
                message = "Password is required";
            } else if (value.length < 6) {
                message = "Password must be atleast 6 characters"
            }
        }

        setErrors(prev => ({
            ...prev,
            [name]: message
        }))
    }

    const isFormValid = email && password && !errors.email && !errors.password;

    const handleLogin = async (e) => {
        e.preventDefault();
        setTouched({
            email: true,
            password: true
        })
        const validationErrors = validateLogin({ email, password });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        setError("")

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace(redirect);
        }
        catch (err) {
            console.error("Login Error: ", err);
            setError(err.message);
        }

        setLoading(false);
    };

    const signInWithGoogle = async () => {
        setLoading(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            await setDoc(
                doc(db, "users", user.uid),
                {
                    email: user.email,
                    role: "user",
                    createdAt: new Date().toISOString()
                },
                { merge: true }
            );
            router.replace("/")
        } catch (err) {
            console.error(err);
            setError("Google Sign-in failed");
        }
        setLoading(false);
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError("");

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(
                doc(db, "users", user.uid),
                {
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL,
                    role: "user",
                    createdAt: new Date().toISOString()
                },
                { merge: true }
            );
            router.replace("/");
        } catch (err) {
            if (err.code === "auth/popup-blocked") {
                setError("Popup blocked. Please allow popups for this site.")
            }
            else if (err.code === "auth/cancelled-popup-request") {
                setError("Login Cancelled")
            } else {
                setError("Google login failed. Please try again.")
                console.log(err);
            }
            console.error(err);
        }
        setGoogleLoading(false);
    }


    useEffect(() => {
        setMounted(true);
    }, [])

    useEffect(() => {
        if (!authLoading && user) {
            router.replace("/");
        }
    }, [user, authLoading, router])

    if (!mounted) return null;
    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleLogin}>
                <h1>Login</h1>
                <p aria-live="assertive" className="srOnly"></p>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        validateField("email", value);
                    }}

                />
                {touched.email && errors.email && (
                    <p className={styles.fieldError} role="alert" aria-live="assertive">{errors.email}</p>
                )}

                <div className={styles.passwordWrapper}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPassword(value);
                            validateField("password", value);
                        }}
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(prev => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <IoEyeOff /> : <IoEye />}
                    </button>
                </div>

                {touched.password && errors.password && (
                    <p className={styles.fieldError} role="alert" aria-live="assertive">{errors.password}</p>
                )}

                {error && <p className={styles.error}>{error}</p>}

                <button type="submit"
                    // disabled={!isFormValid || loading}>
                    className={!isFormValid ? styles.disabledBtn : ""}
                    disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>

                <div className={styles.redirect}>
                    <span>Don't have an account?</span>
                    <Link href="/register">Create One</Link>
                </div>

                {registered && (
                    <p className={styles.success}>
                        Account created successfully. Please Login.
                    </p>
                )}
            </form>
            <div className={styles.directLogin}>
                <div className={styles.divider}>
                    <span>or</span>
                </div>
                <button
                    type="button"
                    className={styles.googleBtn}
                    // onClick={signInWithGoogle}
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <>
                            <FcGoogle size={24} />
                            Signing in...
                        </>
                    ) : (
                        <>
                            <FcGoogle size={24} />
                            continue with google
                        </>
                    )}

                </button>
            </div>
        </div>
    )
}