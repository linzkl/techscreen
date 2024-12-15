import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Metadata = {
  user: '',
  selectedRoomId: '',
};

export const metaSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },
    selectRoom: (state, action: PayloadAction<string>) => {
      state.selectedRoomId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUser, selectRoom } = metaSlice.actions;

export default metaSlice.reducer;
