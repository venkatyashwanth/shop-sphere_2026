"use client";
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function CheckoutPage(){
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    const authLoading = useSelector((state) => state.auth.loading);
    useEffect(() => {
        if(!authLoading && !user){
            router.replace("/login?redirect=/checkout");
        }
    },[user,authLoading,router])

    if(authLoading || !user) return null;

    return(
        <div>
            <h1>Checkout</h1>
        </div>
    )
}