import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include", // отправляем/получаем cookie
    headers: { "Content-Type": "application/json" },
  }),
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({ url: "/users/login", method: "POST", body }),
    }),
    logout: b.mutation({
      query: () => ({ url: "/users/logout", method: "POST" }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
