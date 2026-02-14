import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/features/products/productsSlice";
import cartReducer from "@/features/cart/cartslice";
import { saveCartToStorage } from "@/lib/cartStorage";

export const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer
    }
})

store.subscribe(() => {
    const state = store.getState();
    saveCartToStorage(state.cart);
})