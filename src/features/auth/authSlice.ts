import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLogin, fetchUserApi } from './authApi';

type UserType = {
    id: number,
    uuid: string,
    first_name: string,
    last_name: string,
    email: string,
    email_verified_at: string | null,
    mobile_number: string,
    company: string,
    company_logo: string,
    designation: string,
    pincode: string,
    address: string,
    tnc: number,
    notifications: string,
    created_at: string,
    updated_at: string,
    image: string,
    company_name: string,
    designation_name: string | null,
    deleted_at: string | null
};

type authState = {
    token: string | null,
    loading: boolean,
    error: string | null,
    user: UserType | null,  // Changed to single user instead of array
};

const initialState: authState = {
    token: null,
    loading: false,
    error: null,
    user: null,
};

export const login = createAsyncThunk(
    'auth/login', async (credentials: { email: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await fetchLogin(credentials);
            return response.access_token;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Login Failed');
        }
    }
);

export const fetchUser = createAsyncThunk<UserType, string | null>(
    'auth/fetchUser',
    async (token, { rejectWithValue }) => {
        try {
            if (!token) throw new Error('Token is required');
            const response = await fetchUserApi(token);
            return response.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Fetching User Failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        // pending state for login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fulfilled state for login
        builder.addCase(login.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.token = action.payload;
            state.error = null;
        });

        // rejected state for login
        builder.addCase(login.rejected, (state, action: PayloadAction<unknown>) => {
            state.loading = false;
            state.error = typeof action.payload === 'string' ? action.payload : 'Login Failed';
        });

        // pending state for fetchUser
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fulfilled state for fetchUser
        builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<UserType>) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        });

        // rejected state for fetchUser
        builder.addCase(fetchUser.rejected, (state, action: PayloadAction<unknown>) => {
            state.loading = false;
            state.error = typeof action.payload === 'string' ? action.payload : 'Fetching User Failed';
        });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
