// store/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/users/`, // /api/v1/users или http://localhost:3000/api/v1/users
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }),
  tagTypes: ["Me"],
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({ url: "login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),

    me: b.query({ query: () => "me", providesTags: ["Me"] }),

    logout: b.mutation({
      query: () => ({ url: "logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        // мгновенно выключаем UI:
        dispatch(
          authApi.util.updateQueryData("me", undefined, (draft) => {
            if (draft) draft.user = null;
          })
        );
        try {
          await queryFulfilled;
        } finally {
          // опционально: очистить весь кэш authApi
          dispatch(authApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi;
