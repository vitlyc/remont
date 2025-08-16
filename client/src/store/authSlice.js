import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const slice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {},
  extraReducers: (b) => {
    b.addMatcher(authApi.endpoints.login.matchFulfilled, (s, a) => {
      s.user = a.payload.user;
    });
    b.addMatcher(authApi.endpoints.me.matchFulfilled, (s, a) => {
      s.user = a.payload.user;
    });
    b.addMatcher(authApi.endpoints.logout.matchFulfilled, (s) => {
      s.user = null;
    });
  },
});

export default slice.reducer;
