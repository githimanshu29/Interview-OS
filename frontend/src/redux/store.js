import { configureStore } from "@reduxjs/toolkit";
import resumeSlice from "./resumeSlice";
export const store = configureStore({
  reducer: {
    resume: resumeSlice,
  },
});
