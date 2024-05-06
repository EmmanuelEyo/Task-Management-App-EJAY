import { configureStore, combineReducers } from "@reduxjs/toolkit";
import boardSlice from './boardSlice';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Ensure correct storage type
// import { PersistGate } from "redux-persist/integration/react"; 

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  boards: boardSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer); // Apply persistence

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store); // Create persistor to persist state

export { store, persistor }; // Correctly export both store and persistor