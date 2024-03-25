import { useSelector, useDispatch } from 'react-redux';
import { setCode, setOutput } from '../store';
import { appApi } from '../api';

export const useCompiler = () => {

    const dispatch = useDispatch();
    const { code, output } = useSelector(state => state.compiler);

    const setActiveCode = (code) => {
        dispatch(setCode(code));
    }

    const setCompilerOutput = async () => {
        console.log(code);
        const dataSend = {
            code: code
        }
        const { data } = await appApi.post(`/makeMagic`, dataSend);
        console.log(data.codeOutput.toString());
        const codeOutputString = data.codeOutput.replace("\n", "\n");
        dispatch(setOutput(codeOutputString.toString()));
    }

    return {
        code,
        output,
        setActiveCode,
        setCompilerOutput,
    }
}