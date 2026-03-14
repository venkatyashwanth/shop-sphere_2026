import { createSlice, nanoid } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "toast",
    // initialState: {
    //     message: "",
    //     visible: false,
    // },
    initialState: {
        toasts: [],
    },
    reducers: {
        // showToast: (state,action) => {
        //     state.message = action.payload;
        //     state.visible = true;
        // },
        // hideToast: (state) => {
        //     state.visible = false;
        //     state.message = "";
        // }
        addToast: {
            reducer: (state, action) => {
                state.toasts.unshift(action.payload);
            },
            prepare: (message) => ({
                payload: {
                    id: nanoid(),
                    message,
                }
            })
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(
                (toast) => toast.id !== action.payload
            )
        }
    }
})

// export const { showToast, hideToast } = toastSlice.actions;
export const {addToast,removeToast} = toastSlice.actions;
export default toastSlice.reducer;