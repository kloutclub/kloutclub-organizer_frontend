import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type headingState = {
    pageHeading: string
}

const initialState: headingState = {
    pageHeading: 'Dashboard'
}

const headingSlice = createSlice({
    name: 'heading',
    initialState,
    reducers: {
        heading(state, action: PayloadAction<string>) {
            state.pageHeading = action.payload
        }
    }
});

export const { heading } = headingSlice.actions;

export default headingSlice.reducer

