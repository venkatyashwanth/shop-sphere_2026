"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (_, { rejectWithValue }) => {
        try {
            const snapshot = await getDocs(collection(db, "products"));

            const products = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
                }
            })

            return products;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
        })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "success";
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "error";
                state.error = action.payload;
            })
    }
})

export default productsSlice.reducer;