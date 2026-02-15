import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/features/cart/cartslice";
import { useRouter } from "next/navigation";

export default function ConfirmStep({
  items,
  totalPrice,
  address,
  back,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const handlePlaceOrder = async () => {
    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items,
        totalPrice,
        address,
        status: "placed",
        createdAt: serverTimestamp(),
      });

      dispatch(clearCart());
      router.replace("/order-success");
    } catch (err) {
      console.error("Order Error:", err);
    }
  };

  return (
    <div>
      <h2>Confirm Order</h2>

      <button onClick={back}>Back</button>
      <button onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}
