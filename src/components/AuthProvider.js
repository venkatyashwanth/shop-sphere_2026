"use client";
import { clearUser, setUser } from "@/features/auth/authSlice";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(
                    setUser({
                        uid: user.uid,
                        email: user.email,
                    })
                )
            } else {
                dispatch(clearUser());
            }
        })
        return () => unsubscribe();
    }, [dispatch])

    return children;
}