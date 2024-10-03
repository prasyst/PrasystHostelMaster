import React from 'react'
import { TextField, Grid } from '@mui/material';

const InputField = ({
  id,
  name,
  label,
  variant = "filled",
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  fullWidth = true,
}) => {
  return (
        <Grid item xs={12} md={6} lg={6}>
          <TextField
            id={id}
            name={name}
            label={label}
            variant={variant}
            fullWidth={fullWidth}
            value={value}
            onChange={onChange}
            disabled={disabled}
            error={error}
            helperText={error && helperText}
            className="custom-textfield"
          />
        </Grid>
  );
};

export default InputField;
