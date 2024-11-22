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
    })
})

export const { useLoginMutation } = usersSlice;