import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async fetch from backend API
export const fetchMentorsData = createAsyncThunk(
    "mentors/fetchMentorsData",
    async () => {
        const response = await fetch("https://bacdb.vercel.app/api/mentors", {
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) throw new Error("Failed to fetch mentors");
        const result = await response.json();
        // API returns {success: true, data: [...]}
        return result.data || result;
    }
);

const mentorSlice = createSlice({
    name: "mentors",
    initialState: {
        mentors: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMentorsData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMentorsData.fulfilled, (state, action) => {
                state.loading = false;
                state.mentors = action.payload;
            })
            .addCase(fetchMentorsData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default mentorSlice.reducer;
