import { useState, useEffect } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { Console, TabIde } from '../components';
import { useCompiler } from '../hooks';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export const Home = () => {
    const [data, setData] = useState([])

    const { setActiveCode, setCompilerOutput } = useCompiler();

    const handleUploadFile = (event) => {
        const file = event.target.files
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newData = [...data, {
                    name: file[0].name,
                    content: e.target.result
                }]
                setData(newData)
            }
            reader.readAsText(file[0]);
          }
    }

    useEffect(() => {
        if (data.length > 0) {
            setActiveCode(data[data.length - 1].content)
        } else {
            setActiveCode('')
        }
    }, [data]);

    const handleExecute = () => {
        setCompilerOutput()
    }

    return (
        <Grid container
            columns={12}
            sx={{
                height: '100vh',
            }}
        >
            <Grid item xs={12}
                sx={{
                    padding: 2
                }}
            >
                <Stack 
                    direction="row" 
                    spacing={4}                
                >
                    <Button
                        component="label"
                        tabIndex={-1}
                        onClick={handleUploadFile}
                        type='file'
                        startIcon={<CloudUploadIcon />}
                        sx={{
                            backgroundColor: '#e5b567',
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: '#e5b567'
                            },
                            '&:focus': {
                                backgroundColor: '#e5b567'
                            },
                            '&:active': {
                                backgroundColor: '#e5b567'
                            }
                        
                        }}
                    >
                        Subir Archivo
                        <VisuallyHiddenInput type="file" />
                    </Button>
                    <Button
                        onClick={handleExecute}
                        sx={{
                            backgroundColor: '#b4d273',
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: '#b4d273'
                            },
                            '&:focus': {
                                backgroundColor: '#b4d273'
                            },
                            '&:active': {
                                backgroundColor: '#b4d273'
                            }
                        
                        
                        }}
                    >
                        Ejecutar
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#e87d3e',
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: '#e87d3e'
                            },
                            '&:focus': {
                                backgroundColor: '#e87d3e'
                            },
                            '&:active': {
                                backgroundColor: '#e87d3e'
                            }                        
                        }}
                    >
                        Reportes
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={6}>
                <TabIde 
                    data={data}    
                />
            </Grid>
            <Grid item xs={6}>
                <Console />
            </Grid>
        </Grid>
    )
}