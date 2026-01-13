import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setUsersLoading(state, action) {
      state.loading = action.payload;
    },
    resetUsers() {
      return initialState;
    },
  },
});

export const { setUsers, setUsersLoading, resetUsers } = userSlice.actions;

export default userSlice.reducer;
