import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Attach the token to the Authorization header
      }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const {
  useGetAllDocsQuery,
  useSearchDocsQuery,
  useAddParagraphMutation,
} = apiSlice;
