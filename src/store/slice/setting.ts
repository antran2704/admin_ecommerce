import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitData {
  isOpenSidebar: boolean;
}

const initialState: IInitData = {
  isOpenSidebar: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeSidebar: (state: IInitData, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload;
    },
  },
});

const settingReducer = settingSlice.reducer;

export const { changeSidebar } = settingSlice.actions;
export default settingReducer;
