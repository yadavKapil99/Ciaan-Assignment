// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage
import thunk from 'redux-thunk';
import userReducer from './userSlice.js';
import postReducer from './postSlice.js';

// Combine reducers (even if you have only one for now)
const rootReducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
