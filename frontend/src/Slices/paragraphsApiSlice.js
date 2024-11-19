import { apiSlice } from "../store/apiSlice";

const paragraphsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllParagraphs: builder.query({
        query: () => "/getAll",
        }),
        searchParagraphs: builder.query({
        query: (keyword) => `/search/${keyword}`,
        }),
        addParagraph: builder.mutation({
        query: (newParagraph) => ({
            url: "/getCount",
            method: "POST",
            body: newParagraph,
        }),
        }),
      }),
      overrideExisting: false,
    });

    export const { useGetAllParagraphsQuery, useSearchParagraphsQuery, useAddParagraphMutation } = paragraphsApiSlice;