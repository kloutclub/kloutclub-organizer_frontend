import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchAllSponsors } from './sponsorApi';

type sponsorState = {
    allSponsors: [],
    totalSponsors: number,
    loading: boolean,
    error: string | null
}

const initialState: sponsorState = {
    allSponsors: [],
    totalSponsors: 0,
    loading: false,
    error: null
}

export const fetchSponsor = createAsyncThunk(
    'sponsor/fetchSponsor', async (token: string | null, { rejectWithValue }) => {
        try{
            const response = await fetchAllSponsors(token);
            return response;
        }catch(error){
            return rejectWithValue('Please try again')
        }
    }
)

const sponsorSlice = createSlice({
    name: 'sponsor',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // pending state
        builder.addCase(fetchSponsor.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fulfilled state
        builder.addCase(fetchSponsor.fulfilled, (state, action: PayloadAction<{totalsponsors: number, data: []}>) => {
            state.loading = false;
            state.totalSponsors = action.payload.totalsponsors;
            state.allSponsors = action.payload.data;
            state.error = null;
        });

        // rejected state
        builder.addCase(fetchSponsor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});

export default sponsorSlice.reducer;