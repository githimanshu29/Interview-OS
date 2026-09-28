import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: {
    resume: null,
  },
  reducers: {
    setResume(state, action) {
      state.resume = action.payload;
    },
  },
});

export const { setResume } = resumeSlice.actions;
export default resumeSlice.reducer;
