import { TextareaAutosize } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useCompiler } from '../../hooks';


export const CustomPanel = (props) => {
    const { value, index, content, ...other } = props;
    const [codeView, setCodeView] = useState(content)

    const { setActiveCode } = useCompiler();

    const handleChangeCode = (event) => {
        setCodeView(event.target.value)
        setActiveCode(event.target.value)
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
                <TextareaAutosize
                    minRows={10}
                    value={codeView}
                    style={{ 
                        width: '100%',
                        backgroundColor: '#797979', 
                        border: '1ps solid #797979',
                        color: '#FFFFFF',
                        '&:hover': {
                            border: '1ps solid #797979',
                        },
                        '&:focus': {
                            border: '1ps solid #797979',
                        },
                        '&:active': {
                            border: '1ps solid #797979',
                        },
                        resize: 'none',

                    }}
                    onChange={handleChangeCode}
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