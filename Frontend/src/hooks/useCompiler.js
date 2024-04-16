import { useSelector, useDispatch } from 'react-redux';
import { setCode, setOutput, setAst, clearAst } from '../store';
import { appApi } from '../api';

export const useCompiler = () => {

    const dispatch = useDispatch();
    const { code, output } = useSelector(state => state.compiler);
    const { ast } = useSelector(state => state.reports);

    const setActiveCode = (code) => {
        dispatch(setCode(code));
    }

    const setCompilerOutput = async () => {
        dispatch(clearAst());
        const dataSend = {
            code: code
        }
        const { data } = await appApi.post(`/makeMagic`, dataSend);
        const codeOutputString = data.codeOutput.replace("\n", "\n");
        dispatch(setOutput(codeOutputString.toString()));
        dispatch(setAst(data.ast));
    }

    return {
        code,
        output,
        ast,
        setActiveCode,
        setCompilerOutput,
    }
}