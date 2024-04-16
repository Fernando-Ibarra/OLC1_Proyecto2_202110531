import { useSelector, useDispatch } from 'react-redux';
// import { setErrors, setSymbols, clearErrors, clearSymbols } from '../store';
// import { appApi } from '../api';

export const useReports = () => {

    const dispatch = useDispatch();
    const { ast, errors, symbols } = useSelector(state => state.reports );

    

    return {
        ast, errors, symbols
    }
}