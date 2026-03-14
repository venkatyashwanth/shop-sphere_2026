import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/features/cart/cartslice";
import authReducer from "@/features/auth/authSlice";
import productReducer from "@/features/products/productsSlice";
import toastReducer from "@/features/toast/toastSlice";

import { saveCartToStorage } from "@/lib/cartStorage";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
        products: productReducer,
        toast: toastReducer,
    }
})

store.subscribe(() => {
    const state = store.getState();
    saveCartToStorage(state.cart);
})