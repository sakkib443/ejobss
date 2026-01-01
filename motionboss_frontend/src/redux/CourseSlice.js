import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:5000/api";

// Fetch all courses
export const fetchCoursesData = createAsyncThunk(
  "courses/fetchCoursesData",
  async () => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch courses");
    const result = await response.json();
    return result.data;
  }
);

// Fetch course content for student (enrolled only)
export const fetchCourseContent = createAsyncThunk(
  "courses/fetchCourseContent",
  async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/courses/${id}/content`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch course content");
    }
    const result = await response.json();
    return result.data;
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    currentCourse: null,
    loading: false,
    contentLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursesData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCoursesData.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCoursesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // fetchCourseContent
      .addCase(fetchCourseContent.pending, (state) => { state.contentLoading = true; })
      .addCase(fetchCourseContent.fulfilled, (state, action) => {
        state.contentLoading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseContent.rejected, (state, action) => {
        state.contentLoading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
