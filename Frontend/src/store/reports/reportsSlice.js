import { createSlice } from '@reduxjs/toolkit';

export const reportsSlice = createSlice({
    name: 'reports',
    initialState: {
        ast: '',
        errors: '',
        symbols: '',
    },
    reducers: {
        setAst: (state, { payload }) => {
            state.ast = payload
        },
        setErrors: (state, { payload }) => {
            state.errors = payload
        },
        setSymbols: (state, { payload }) => {
            state.symbols = payload
        },
        clearAst: (state) => {
            state.ast = ''
        },
        clearErrors: (state) => {
            state.errors = ''
        },
        clearSymbols: (state) => {
            state.symbols = ''
        },
    }
});

export const { 
    setAst, 
    setErrors, 
    setSymbols,
    clearAst,
    clearErrors,
    clearSymbols
} = reportsSlice.actions;