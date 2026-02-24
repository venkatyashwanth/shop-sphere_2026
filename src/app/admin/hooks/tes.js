"use client";

import { useEffect } from "react";
import styles from "./Toast.module.scss";

export default function Toast({
  message,
  visible,
  onClose,
}) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.toast}>
      <span>🎉</span>
      <p>{message}</p>
    </div>
  );
}