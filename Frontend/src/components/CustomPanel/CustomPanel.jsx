import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from '@monaco-editor/react';

import { useCompiler } from '../../hooks';


export const CustomPanel = (props) => {
    const { value, index, content, ...other } = props;

    const editorRef = useRef(null);
    const [codeView, setCodeView] = useState(content)

    const { setActiveCode } = useCompiler();

    const handleChangeCode = () => {
        setCodeView(editorRef.current?.getValue())
        setActiveCode(editorRef.current?.getValue())
    }

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    }

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Editor
                    defaultLanguage="cpp"
                    language="cpp"
                    defaultValue={content}
                    value={codeView}
                    onMount={handleEditorDidMount}
                    height="90vh"
                    width="100%"
                    onChange={handleChangeCode}
                    theme='vs-dark'
                    
                />
            )}          
        </div>
    )
}

CustomPanel.propTypes = {
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired
};