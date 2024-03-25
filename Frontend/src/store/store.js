import { configureStore } from '@reduxjs/toolkit';
import { compilerSlice } from './compiler';

export const store = configureStore({
    reducer : {
        compiler: compilerSlice.reducer
    }
});