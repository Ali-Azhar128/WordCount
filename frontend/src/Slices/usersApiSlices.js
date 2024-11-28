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
        }
      ),
    }),

    guestLogin: builder.mutation({
      query: (username) => ({
        url: "/auth/guestLogin",
        method: "POST",
        body: { username },
      }),
    }),
  }),
});

export const { useLoginMutation, useUserLoginMutation, useGuestLoginMutation } =
  usersSlice;
