import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';

import { CustomPanel } from '../';

export const TabIde = (props) => {
    
    const { data } = props;
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    }


    return (
        <Box
            sx={{
                padding: 3
            }}
        >
            <Tabs
                value={value}
                onChange={handleChange}
                variant='fullWidth'
                sx={{
                    backgroundColor: 'trasparent',
                }}
            >
                {
                    data.map((item, index) => (
                        <Tab
                            label={item.name}
                            key={index}
                            sx={{
                                backgroundColor: 'trasparent',
                                color: 'FFFFFF',
                                '&:hover': {
                                    backgroundColor: 'trasparent',
                                    color: '#FFFFFF',
                                    borderBottom: '1px solid #FFFFFF'
                                },
                                '&:focus': {
                                    backgroundColor: 'trasparent',
                                    color: '#FFFFFF'
                                },
                                '&:active': {
                                    backgroundColor: 'trasparent',
                                    color: '#FFFFFF'
                                }
                            }}
                        />
                    ))
                }
            </Tabs>
            {
                data.map((item, index) => (
                    <CustomPanel value={value} content={item.content} index={index} key={index} />
                ))
            }
        </Box>
    )
}

TabIde.propTypes = {
    data: PropTypes.array.isRequired
};