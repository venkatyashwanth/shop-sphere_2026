"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "@/features/toast/toastSlice";
import styles from "./Toast.module.scss";
import ToastItem from "./ToastItem";

export default function Toast(){
    // const dispatch = useDispatch();
    // const {message,visible} = useSelector((state) => state.toast);
    const toasts = useSelector((state) => state.toast.toasts);
    // useEffect(() => {
    //     if(visible){
    //         const timer = setTimeout(() => {
    //             dispatch(hideToast());
    //         }, 2500)
    //         return () => clearTimeout(timer);
    //     }
    // },[visible,dispatch])
    // if(!visible) return null;
    return(
        <div className = {styles.toastNotification}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast}/>
            ))}
        </div>
    )
}