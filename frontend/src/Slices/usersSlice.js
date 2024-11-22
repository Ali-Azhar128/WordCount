import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
}

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setLoginInfo: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },
    },
});

export const { setLoginInfo } = usersSlice.actions;

export default usersSlice.reducer;
