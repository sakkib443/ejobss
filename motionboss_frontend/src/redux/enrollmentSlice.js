import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = "http://localhost:5000/api";

export const fetchMyEnrollments = createAsyncThunk(
    'enrollment/fetchMyEnrollments',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/enrollments/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Enrollment fetch error:', data.message);
                return rejectWithValue(data.message || 'Failed to fetch enrollments');
            }
            console.log('Enrollments fetched successfully:', data.data?.length, 'found');
            return data.data;
        } catch (error) {
            console.error('Enrollment fetch exception:', error.message);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchMyStats = createAsyncThunk(
    'enrollment/fetchMyStats',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/enrollments/my/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.message || 'Failed to fetch stats');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const enrollmentSlice = createSlice({
    name: 'enrollment',
    initialState: {
        enrollments: [],
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.loading = false;
                state.enrollments = action.payload;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export default enrollmentSlice.reducer;
