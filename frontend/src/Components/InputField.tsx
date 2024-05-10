import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface InputFieldProps {
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, onChange }) => {
    const [internalValue, setInternalValue] = React.useState('');

    return (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '800px', height: '80px' }, // change width here
            }}
            noValidate
            autoComplete="off"
        >
            <TextField 
                id="outlined-basic" 
                label={label}
                placeholder={placeholder}
                variant="outlined" 
                value={internalValue}
                onChange={(event) => {
                    setInternalValue(event.target.value);
                    onChange(event.target.value);
                }} 
                sx={{
                    '& .MuiInputLabel-root': { 
                        color: 'white',
                        '&.Mui-focused': {
                            color: '#DBF881',
                        },
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'white' },
                        '&:hover fieldset': { borderColor: 'white' },
                        '&.Mui-focused fieldset': { borderColor: '#DBF881' },
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                }}
            />
        </Box>
    );
};

export default InputField;
