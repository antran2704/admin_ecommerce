import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserSlice } from "../types/userSlice.type";
import { AsyncThunkConfig, RootState } from "../types";
import apiMeService from "~/api-client/me";
import { IMeProfile } from "~/page/Account/interfaces";

const initInfoUser: IMeProfile = {
  userId: "",
  name: "",
  email: "",
  avatar: "",
  role: "",
  roleId: "",
  groupRole: "",
  groupRoleId: "",
  isActive: true,
  isAdmin: false,
  createdAt: "",
};

const userInfo: IUserSlice = {
  infoUser: initInfoUser,
  permission: [],
  loadingUser: false,
};

const fetchUserAsyncThunk = createAsyncThunk<any, void, AsyncThunkConfig>(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      return apiMeService.getProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: userInfo,
  reducers: {
    setInforUser: (state, action: PayloadAction<IMeProfile>) => {
      state.infoUser = action.payload;
    },
    updatePermission: (state, action: PayloadAction<string[]>) => {
      state.permission = action.payload;
    },
    logoutUser: (state) => {
      state.infoUser = initInfoUser;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchUserAsyncThunk.fulfilled,
      (state, action: PayloadAction<IMeProfile>) => {
        state.infoUser = action.payload;

        state.loadingUser = false;
      },
    );
    builder.addCase(fetchUserAsyncThunk.pending, (state) => {
      state.loadingUser = true;
    });
    builder.addCase(fetchUserAsyncThunk.rejected, (state) => {
      state.loadingUser = false;
    });
  },
});

const userReducer = userSlice.reducer;

export const { setInforUser, logoutUser, updatePermission } = userSlice.actions;
export { fetchUserAsyncThunk };

export const selectUserSlice = (state: RootState) => state.user;

export default userReducer;
