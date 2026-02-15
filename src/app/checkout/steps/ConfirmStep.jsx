import { clearCart } from "@/features/cart/cartslice";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux"

export default function ConfirmStep({
    items,
    totalPrice,
    address,
    user,
    back,
}) {
    const dispatch = useDispatch();
    const router = useRouter();
    // const user = useSelector((state) => state.auth.user);
    const handlePlaceOrder = async () => {
        if(!user){
            console.error("user not authenticated");
            return;
        }
        try {
            await addDoc(collection(db, "orders"), {
                userId: user.uid,
                userEmail: user.email,
                items,
                totalPrice,
                address,
                status: "placed",
                createdAt: serverTimestamp(),
            })
            dispatch(clearCart());
            // router.replace("/order-success");
            router.replace("/");
        } catch (err) {
            console.error("Order Error: ", err);
        }
    }
    return (
        <>
            <h2>Confirm Order</h2>
            <button onClick={back}>Back</button>
            <button onClick={handlePlaceOrder} disabled={!user}>Place Order</button>
        </>
    )
}