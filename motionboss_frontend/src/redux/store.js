import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./CourseSlice";
import categoryReducer from "./categorySlice";
import mentorReducer from "./mentorSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    categories: categoryReducer,
    mentors: mentorReducer,
  },
});



