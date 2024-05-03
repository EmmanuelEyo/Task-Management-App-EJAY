import { configureStore } from "@reduxjs/toolkit";
import boardSlice from './boardSlice'

const store = configureStore({
    reducer: {
        boards: boardSlice,
    }
})

export default store