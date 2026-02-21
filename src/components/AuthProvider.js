"use client";
import { clearUser, setUser } from "@/features/auth/authSlice";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                    const role = userDoc.exists() ? userDoc.data().role : "user";
                    dispatch(
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role
                        })
                    )
                } catch (error) {
                    console.error("Error fetching user role: ", error);
                    dispatch(
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: "user"
                        })
                    )
                }
            } else {
                dispatch(clearUser());
            }
        })
        return () => unsubscribe();
    }, [dispatch])

    return children;
}