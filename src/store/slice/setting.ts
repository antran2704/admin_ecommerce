import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISettingSlice } from "../types/settingSlice.type";

const initialState: ISettingSlice = {
  isOpenSidebar: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeSidebar: (state: ISettingSlice, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
  },
});

const settingReducer = settingSlice.reducer;

export const { changeSidebar } = settingSlice.actions;
export default settingReducer;
