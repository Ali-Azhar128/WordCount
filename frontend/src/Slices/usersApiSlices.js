import { apiSlice } from "../store/apiSlice";

const usersSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => (
        console.log(user, "User"),
        {
          url: "/auth/login",
          method: "POST",
          body: { email: user.email, pass: user.pass },
          credentials: 'include'
        }
      ),
    }),

    userLogin: builder.mutation({
      query: (user) => (
        console.log(user, "User"),
        {
          url: "/auth/register",
          method: "POST",
          body: {
            email: user.email,
            password: user.pass,
            username: user.username,
            role: user.role,
          },
          credentials: 'include'
        }
      ),
    }),

    guestLogin: builder.mutation({
      query: (username) => ({
        url: "/auth/guestLogin",
        method: "POST",
        body: { username },
        credentials: 'include'
      }),
    }),
  }),
});

export const { useLoginMutation, useUserLoginMutation, useGuestLoginMutation } =
  usersSlice;
