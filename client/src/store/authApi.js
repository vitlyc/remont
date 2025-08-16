// store/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL, //http://localhost:3000/api/v1/users
    credentials: "include",
  }),
  tagTypes: ["Me"],
  endpoints: (b) => ({
    me: b.query({ query: () => "me", providesTags: ["Me"] }),

    login: b.mutation({
      query: (body) => ({ url: "login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),

    logout: b.mutation({
      query: () => ({ url: "logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(
          authApi.util.updateQueryData(
            "me",
            undefined,
            (d) => d && (d.user = null)
          )
        );
        await queryFulfilled.finally(() =>
          dispatch(authApi.util.invalidateTags(["Me"]))
        );
      },
    }),
  }),
});

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authApi;
