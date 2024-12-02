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
          query: ({keyword, page, userId, role}) => `/searchPage?keyword=${keyword}&page=${page}&perPage=5&userId=${userId}&role=${role}`,
          
      }),
      providesTags: ["Paragraph"],
      
        addParagraph: builder.mutation({
        query: (newParagraph) => ({
            url: "/getCount",
            method: "POST",
            body: newParagraph,
            credentials: 'include'
        }),
        providesTags: ["Paragraph"],
        }),

        flagItem: builder.mutation({
          query: (id) => ({
              url: `/flagItem`,
              method: "PUT",
              body: {id},
              credentials: 'include'
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

        findByID: builder.query({
          query: (id) => `/findById?id=${id}`,
        }),
      }),
      overrideExisting: false,
    });

export const { useGetAllParagraphsQuery, useSearchParagraphsQuery, useGetPageQuery, useSearchParaWithPageNumberQuery, useAddParagraphMutation, useFlagItemMutation, useDeleteItemMutation, useFindByIDQuery } = paragraphsApiSlice;