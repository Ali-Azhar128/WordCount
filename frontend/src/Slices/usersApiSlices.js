import { apiSlice } from "../store/apiSlice";

const usersSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (user) => (
                console.log(user, 'User'),
                {
                url: "/auth/login",
                method: "POST",
                body: {email: user.email, pass: user.pass},
            }),
        }),

        userLogin: builder.mutation({
            query: (user) => (
                console.log(user, 'User'),
                {
                url: "/auth/register",
                method: "POST",
                body: {email: user.email, password: user.pass, username: user.username, role: user.role},
            }),
        }),
    })
})

export const { useLoginMutation, useUserLoginMutation } = usersSlice;