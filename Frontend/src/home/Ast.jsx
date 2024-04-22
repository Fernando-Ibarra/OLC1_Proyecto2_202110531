import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, Stack } from '@mui/material';
import { Graphviz } from 'graphviz-react';

import { useCompiler } from '../hooks';

export const Ast = () => {

    const { ast } = useCompiler();


    return (
        <Grid container
            columns={12}
            sx={{
                height: '100%',
            }}
        >
            <Grid item xs={12}
                sx={{
                    padding: 2
                }}
            >
                <Stack direction='row' spacing={2}>
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
                        <Link
                            to={`/`}
                            component={RouterLink}
                            underline='none'
                            sx={{
                            margin: '0',
                            padding: '0',
                            width: '100%',
                            color: '#000000',
                            }}
                        >
                            Código
                        </Link>
                    </Button>
                    <Button
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
                        <Link
                            to={`/errors`}
                            component={RouterLink}
                            underline='none'
                            sx={{
                            margin: '0',
                            padding: '0',
                            width: '100%',
                            color: '#000000',
                            }}
                        >
                            ERRORES
                        </Link>
                    </Button>
                    <Button
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
                        <Link
                            to={`/symbols`}
                            component={RouterLink}
                            underline='none'
                            sx={{
                            margin: '0',
                            padding: '0',
                            width: '100%',
                            color: '#000000',
                            }}
                        >
                            SIMBOLOS
                        </Link>
                    </Button>
                </Stack>
            </Grid>
            <Grid item xs={12}
                sx={{
                    padding: 2
                }}
            >
                <Graphviz dot={ast}
                    options={{
                        width: '100%',
                        height: 1000,
                        zoom: true,
                    }}
                />
            </Grid>
        </Grid>
    )
}
