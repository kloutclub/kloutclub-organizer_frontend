import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addAttendee, fetchTotalAttendee } from './attendeeApi';

type attendeeState = {
    allAttendees: [],
    loading: boolean,
    error: string | null,
    currentAttendeeUUID: string | null;
};

interface AddAttendeeResponse {
    data: FormData;
}

const initialState: attendeeState = {
    allAttendees: [],
    currentAttendeeUUID: null,
    loading: false,
    error: null
};

export const fetchAllAttendees = createAsyncThunk(
    'attendee/fetchAllAttendees', async (token: string | null, { rejectWithValue }) => {
        try {

            const response = await fetchTotalAttendee(token);
            return response;

        } catch (error) {
            return rejectWithValue('please try again')
        }
    }
);

export const addNewAttendee = createAsyncThunk<AddAttendeeResponse, { formData: FormData, token: string | null }>(
    "attendee/addNewAttendee",
    async ({ formData, token }, { rejectWithValue }) => {
        try {
            return await addAttendee(formData, token);
        } catch (error) {
            return rejectWithValue('Failed to add new attendee');
        }
    }
);

const attendeeSlice = createSlice({
    name: 'attendee',
    initialState,
    reducers: {
        attendeeUUID(state, action: PayloadAction<string>) {
            state.currentAttendeeUUID = action.payload;
        },
    },
    extraReducers: (builder) => {
        // pending State
        builder.addCase(fetchAllAttendees.pending, (state) => {
            state.loading = true;
            state.error = null;
        });

        // fulfilled state
        builder.addCase(fetchAllAttendees.fulfilled, (state, action: PayloadAction<{ total_attendees: [] }>) => {
            state.loading = false;
            state.allAttendees = action.payload.total_attendees;
            state.error = null;
        });

        // rejected state
        builder.addCase(fetchAllAttendees.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    }
});
export const { attendeeUUID } = attendeeSlice.actions;

export default attendeeSlice.reducer;


