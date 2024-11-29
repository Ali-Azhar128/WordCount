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

        removeUserInfo: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
        }
    },
});

export const { setLoginInfo, removeUserInfo } = usersSlice.actions;

export default usersSlice.reducer;
