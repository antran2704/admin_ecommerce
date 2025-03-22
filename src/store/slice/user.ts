import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ENUM_GENDER } from "~/enum/user";
import { IProfile } from "~/interface/profile";

interface IInforUserSlice {
  infoUser: IProfile;
  permission: string[];
  loadingUser: boolean;
}

const initInfoUser: IProfile = {
  userId: "",
  idCard: "",
  phoneNumber: "",
  imageProfile: null,
  dateOfBirth: "",
  email: "",
  fullName: "",
  gender: ENUM_GENDER.MALE,
  address: "",
  createdAt: "",
  workLocationAddress: "",
  workLocationId: "",
  isAdmin: false,
  isActive: true,
  roleNames: [],
  roles: [],
  groups: [],
};

const userInfo: IInforUserSlice = {
  infoUser: initInfoUser,
  permission: [],
  loadingUser: false,
};

const fetchUser = createAsyncThunk("user/fetchUserInfo", async () => {
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState: userInfo,
  reducers: {
    setInforUser: (state, action: PayloadAction<IProfile>) => {
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
      fetchUser.fulfilled,
      (state, action: PayloadAction<IProfile>) => {
        state.infoUser = action.payload;

        state.loadingUser = false;
      },
    );
    builder.addCase(fetchUser.pending, (state) => {
      state.loadingUser = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.loadingUser = false;
    });
  },
});

const userReducer = userSlice.reducer;

export const { setInforUser, logoutUser, updatePermission } = userSlice.actions;
export { fetchUser };
export default userReducer;
