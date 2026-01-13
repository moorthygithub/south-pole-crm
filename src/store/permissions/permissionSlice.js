import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pagePermissions: [],
  buttonPermissions: [],
  loading: false,
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissionLoading(state, action) {
      state.loading = action.payload;
    },
    setPagePermissions(state, action) {
      state.pagePermissions = action.payload;
    },
    setButtonPermissions(state, action) {
      state.buttonPermissions = action.payload;
    },
    resetPermissions() {
      return initialState;
    },
  },
});

export const {
  setPermissionLoading,
  setPagePermissions,
  setButtonPermissions,
  resetPermissions,
} = permissionSlice.actions;

export default permissionSlice.reducer;
