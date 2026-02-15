"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import AddressStep from "./steps/AddressStep";
import ReviewStep from "./steps/ReviewStep";
import ConfirmStep from "./steps/ConfirmStep";
import styles from "./page.module.scss";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  const { items, totalPrice } = useSelector(
    (state) => state.cart
  );

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className={styles.wrapper}>
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
          back={() => setStep(2)}
        />
      )}
    </div>
  );
}
