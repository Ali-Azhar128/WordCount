import { apiSlice } from "../store/apiSlice";

const paragraphsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllParagraphs: builder.query({
        query: () => "/getAll",
        }),
        searchParagraphs: builder.query({
        query: (keyword) => `/search?${keyword}`,
        }),

        getPage: builder.query({
            query: (page) => `/getPage?page=${page}`,
        }),
        providesTags: ["Paragraph"],

        searchParaWithPageNumber: builder.query({
          query: ({keyword, page}) => `/searchPage?keyword=${keyword}&page=${page}&perPage=5`,
      }),
      providesTags: ["Paragraph"],
      
        addParagraph: builder.mutation({
        query: (newParagraph) => ({
            url: "/getCount",
            method: "POST",
            body: newParagraph,
        }),
        providesTags: ["Paragraph"],
        }),

        flagItem: builder.mutation({
          query: (id) => ({
              url: `/flagItem`,
              method: "PUT",
              body: {id},
          }),
          invalidatesTags: ["Paragraph"],
      }),

      deleteItem: builder.mutation({
        query: (id) => ({
            url: `/deleteItem`,
            method: "DELETE",
            body: {id},
        }),
        invalidatesTags: ["Paragraph"],
    }),
      }),
      overrideExisting: false,
    });

export const { useGetAllParagraphsQuery, useSearchParagraphsQuery, useGetPageQuery, useSearchParaWithPageNumberQuery, useAddParagraphMutation, useFlagItemMutation, useDeleteItemMutation } = paragraphsApiSlice;