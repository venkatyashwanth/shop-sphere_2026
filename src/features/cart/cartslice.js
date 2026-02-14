import { createSlice } from "@reduxjs/toolkit";
import { localCartFromStorage } from "@/lib/cartStorage";

const persistedCart = localCartFromStorage();

const initialState = persistedCart || {
    items: [],
    totalQuantity: 0,
    totalPrice: 0
}

const calculateTotals = (items) => {
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return { totalQuantity, totalPrice };
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find((item) => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 })
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalPrice = totals.totalPrice;
        },
        increaseQuantity: (state, action) => {
            const id = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item) { item.quantity += 1 }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalPrice = totals.totalPrice;
        },
        decreaseQuanity: (state, action) => {
            const id = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (!item) return;
            if (item.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== id);
            } else {
                item.quantity -= 1;
            }

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalPrice = totals.totalPrice;
        },
        removeItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((item) => item.id !== id);

            const totals = calculateTotals(state.items);
            state.totalQuantity = totals.totalQuantity;
            state.totalPrice = totals.totalPrice;
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
        }
    }
})

export const { addToCart, increaseQuantity, decreaseQuanity, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;