import { Grid, TextareaAutosize, Typography } from '@mui/material';
import { useCompiler } from '../../hooks';
import { useEffect } from 'react';

export const Console = () => {

    const { output } = useCompiler();

    useEffect(() => {

    }, [output])

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
                <TextareaAutosize 
                    disabled
                    value={output}
                    minRows={3}
                    style={{ 
                        width: '100%', 
                        backgroundColor: '#797979',
                        border: '1px solid #797979',
                        color: '#FFFFFF',
                        '&:hover': {
                            borderColor: '#6082B6',
                            color: '#FFFFFF',
                        },
                        '&:focus': {
                            borderColor: '#6082B6',
                            color: '#FFFFFF',
                        },
                        '&:active': {
                            borderColor: '#6082B6',
                            color: '#FFFFFF',
                        },
                        resize: 'none',
                        height: '100%'
                    }}
                />
            </Grid>

        </Grid>
    )
}
