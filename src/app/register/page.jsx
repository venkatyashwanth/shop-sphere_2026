"use client";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useSelector } from "react-redux";
import { doc, setDoc } from "firebase/firestore";
import { validateLogin } from "@/lib/validators/authValidators";

export default function RegisterPage() {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState("");
    const [passwordMatch, setPasswordMatch] = useState(null);
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})

    const [capsLock, setCapsLock] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateField = (name, value) => {
        let message = "";
        if (name === "email") {
            if (!value) message = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Enter a valid email"
            }
        }
        if (name === "password") {
            if (!value) message = "Password is required";
            else if (value.length < 6) {
                message = "Password must be at least 6 characters"
            }
        }
        if (name === "confirmPassword") {
            if (!value) message = "Please confirm password";
            else if (value !== password) {
                message = "Passwords do not match"
            }
        }
        setErrors(prev => ({
            ...prev,
            [name]: message
        }))

    }

    const calculateStrength = (password) => {
        let score = 0;

        if (password.length > 6) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score;

    }

    const isFormValid = email && password && confirmPassword && !errors.email && !errors.password && !errors.confirmPassword;

    const handleRegister = async (e) => {
        e.preventDefault();
        setTouched({
            email: true,
            password: true,
            confirmPassword: true,
        })
        const validationErrors = validateLogin({ email, password });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({})
        setLoading(true);
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
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
        if (!authLoading && user) {
            router.replace("/");
        }
    }, [user, authLoading, router])

    if (authLoading) return null;

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleRegister}>
                <h1>Create Account</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onBlur={() => {
                        setTouched(prev => ({ ...prev, email: true }))
                    }}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        validateField("email", value);
                    }} />

                {touched.email && errors.email && (
                    <p className={styles.fieldError} role="alert" aria-live="assertive">{errors.email}</p>
                )}

                <div className={styles.passwordField}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                        onChange={(e) => {
                            const value = e.target.value
                            setPassword(value)
                            validateField("password", value);
                            setPasswordStrength(calculateStrength(value))
                            if (confirmPassword) {
                                validateField("confirmPassword", confirmPassword)
                                setPasswordMatch(confirmPassword === value);
                            }
                        }}
                        onKeyUp={(e) => {
                            setCapsLock(e.getModifierState("CapsLock"));
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
                    <div className={styles.strengthMeter}>
                        <div className={`${styles.strengthBar} ${styles[`strength${passwordStrength}`]}`} />
                    </div>
                </div>
                {capsLock && (
                    <p className={styles.warning}>
                        Caps Lock is ON
                    </p>
                )}
                {touched.password && errors.password && (
                    <p className={styles.fieldError} role="alert" aria-live="assertive">{errors.password}</p>
                )}
                <div className={styles.passwordField}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Type to confirm password"
                        value={confirmPassword}
                        onBlur={() => {
                            setTouched(prev => ({ ...prev, confirmPassword: true }))
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            setConfirmPassword(value);
                            validateField("confirmPassword", value);
                            if (!value) {
                                setPasswordMatch(null);
                            } else if (value === password) {
                                setPasswordMatch(true)
                            } else {
                                setPasswordMatch(false)
                            }
                        }}
                    />
                    <button
                        type="button"
                        className={styles.togglePassword}
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                        {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                    </button>
                </div>
                {passwordMatch === true && (
                    <p className={styles.success}>
                        ✓ Passwords Match
                    </p>
                )}
                {touched.confirmPassword && errors.confirmPassword && (
                    <p className={styles.fieldError} role="alert" aria-live="assertive">{errors.confirmPassword}</p>
                )}
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" 
                className={!isFormValid ? styles.disabledBtn : ""}
                disabled={loading}>
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