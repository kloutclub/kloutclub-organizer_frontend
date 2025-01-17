import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux"; // Import combineReducers
import eventReducer from '../features/event/eventSlice';
import authReducer from '../features/auth/authSlice';
import attendeeReducer from '../features/attendee/attendeeSlice';
import sponsorReducer from '../features/sponsor/sponsorSlice';
import pageHeadingReducer from '../features/heading/headingSlice';
import { useDispatch } from 'react-redux';

// Persist config for the entire store
const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    events: eventReducer,
    auth: authReducer,
    attendee: attendeeReducer,
    sponsor: sponsorReducer,
    pageHeading: pageHeadingReducer,
});

// Apply persistReducer to the combined rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);

export default store;
