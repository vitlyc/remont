// store/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/users/",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }),
  tagTypes: ["Me"],
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({ url: "login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    logout: b.mutation({
      query: () => ({ url: "logout", method: "POST" }),
      invalidatesTags: ["Me"],
    }),
    me: b.query({ query: () => "me", providesTags: ["Me"] }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
