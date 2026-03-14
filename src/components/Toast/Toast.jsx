"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "@/features/toast/toastSlice";
import styles from "./Toast.module.scss";

export default function Toast(){
    const dispatch = useDispatch();
    const {message,visible} = useSelector((state) => state.toast);
    useEffect(() => {
        if(visible){
            const timer = setTimeout(() => {
                dispatch(hideToast());
            }, 2500)
            return () => clearTimeout(timer);
        }
    },[visible,dispatch])
    if(!visible) return null;
    return(
        <div className = {styles.toastNotification}>
            {message}
        </div>
    )
}