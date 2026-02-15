"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./page.module.scss";
import AddressStep from "./steps/AddressStep";
import ReviewStep from "./steps/ReviewStep";
import ConfirmStep from "./steps/ConfirmStep";
export default function CheckoutPage() {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);

    const { items, totalPrice } = useSelector((state) => state.cart);

    const [step, setStep] = useState(1);

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        pincode: ""
    })

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/login?redirect=/checkout");
        }
    }, [user, authLoading, router])

    if (authLoading || !user) return null;

    if (items.length === 0) {
        return <p>Your cart is empty.</p>
    }

    return (
        <div className={`${styles.wrapper} ${styles.checkoutForm}`}>
            {step === 1 && (
                <AddressStep
                    address={address}
                    setAddress={setAddress}
                    next={() => setStep(2)}
                />
            )}
            {step === 2 && (
                <ReviewStep
                    items={items}
                    totalPrice={totalPrice}
                    back={() => setStep(1)}
                    next={() => setStep(3)}
                />
            )}
            {step === 3 && (
                <ConfirmStep
                    items={items}
                    totalPrice={totalPrice}
                    address={address} 
                    user={user}
                    back={() => setStep(2)} 
                />
            )}
        </div>
    )
}