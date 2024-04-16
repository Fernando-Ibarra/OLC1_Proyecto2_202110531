import { Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
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
            <Grid item xs={12}>
                <Link component={RouterLink} to="/">Codigo</Link>
            </Grid>
            <Grid item xs={12}>
                <Graphviz dot={ast}
                    options={{
                        width: '100%',
                        height: 800,
                        zoom: true,
                    }}
                />
            </Grid>
        </Grid>
    )
}
