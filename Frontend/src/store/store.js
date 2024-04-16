import { configureStore } from '@reduxjs/toolkit';
import { compilerSlice, reportsSlice  } from './';

export const store = configureStore({
    reducer : {
        compiler: compilerSlice.reducer,
        reports: reportsSlice.reducer
    }
});