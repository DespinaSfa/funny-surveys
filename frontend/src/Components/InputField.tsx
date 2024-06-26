import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface InputFieldProps {
    label: string;
    placeholder: string;
    onChange: (value: string) => void;
    startIcon?: JSX.Element;
    type?: string;
    sx?: any;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, onChange, startIcon, type, sx }) => {
    const [internalValue, setInternalValue] = React.useState('');

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                '& > :not(style)': { m: 0 },
                width: '100%',
                ...sx,
            }}
            noValidate
            autoComplete="off"
        >
            <TextField 
                label={label}
                placeholder={placeholder}
                variant="outlined" 
                value={internalValue}
                onChange={(event) => {
                    setInternalValue(event.target.value);
                    onChange(event.target.value);
                }} 
                InputProps={{
                    startAdornment: startIcon, 
                }}
                type={type}
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
                    ...sx
                }}
            />
        </Box>
    );
};

export default InputField;
