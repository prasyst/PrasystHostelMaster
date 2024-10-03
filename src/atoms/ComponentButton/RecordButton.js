import React from 'react';
import Button from '@mui/material/Button';

const RecordButton = ({ 
  variant = "contained", 
  onClick,
  backgroundColor = '#7c3aed', 
  color = 'white',
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        '&:hover': {
          backgroundColor: backgroundColor,
        },
      }}
    >
      Add New Record
    </Button>
  );
};

export default RecordButton;
