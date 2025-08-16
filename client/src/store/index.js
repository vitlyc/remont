// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import auth from "./authSlice";

export const store = configureStore({
  reducer: { [authApi.reducerPath]: authApi.reducer, auth },
  middleware: (gDM) => gDM().concat(authApi.middleware),
});
