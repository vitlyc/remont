// store/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1/`, // /api/v1/users или http://localhost:3000/api/v1/users
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  }),
  tagTypes: ["Me", "Cases"], // добавили "Cases" для тегов, если нужно кэшировать данные
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({ url: "users/login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),

    me: b.query({ query: () => "users/me", providesTags: ["Me"] }),

    logout: b.mutation({
      query: () => ({ url: "users/logout", method: "POST" }),
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
    createCase: b.mutation({
      query: (newCaseData) => ({
        url: "cases/createCase",
        method: "POST",
        body: newCaseData, // Передаем данные нового дела
      }),
      invalidatesTags: ["Cases"], // Если нужно сбросить кэш всех дел после создания нового
    }),

    // Новый запрос для получения всех дел пользователя
    getUserCases: b.query({
      query: () => "cases/getUserCases", // Ваш путь к эндпоинту для получения дел
      providesTags: ["Cases"], // Кэшируем данные дел пользователя
    }),
    createDocument: b.mutation({
      query: (payload) => ({
        url: "documents/createDocument",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useCreateCaseMutation,
  useGetUserCasesQuery,
  useCreateDocumentMutation,
} = authApi;
