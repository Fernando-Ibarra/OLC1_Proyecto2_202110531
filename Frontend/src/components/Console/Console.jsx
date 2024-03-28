import { useEffect, useRef } from 'react';
import { Grid, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';


import { useCompiler } from '../../hooks';

export const Console = () => {

    const editorRef = useRef(null);
    const { output } = useCompiler();

    useEffect(() => {

    }, [output])

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    }

    return (
        <Grid container
            columns={12}
            spacing={2}
            sx={{
                padding: 3
            }}
        >
            <Grid item xs={12}>
                <Typography 
                    variant="h6"
                    sx={{
                        color: '#FFFFFF'
                    }}
                >
                    Consola
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Editor
                    defaultLanguage="cpp"
                    language="cpp"
                    defaultValue={output}
                    value={output}
                    onMount={handleEditorDidMount}
                    height="90vh"
                    width="100%"
                    theme='vs-dark'
                />
            </Grid>

        </Grid>
    )
}
