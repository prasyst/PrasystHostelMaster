import React, { forwardRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import  FormControl  from '@mui/material/FormControl';


const CountryAutocomplete = React.forwardRef(({ countries, value, onChange, disabled, error, helperText, onKeyDown }, ref) => {
    const selectedCountry = countries.find(country => country.id.toString() === value?.toString());
    const inputStyle = error ? { Color: 'red' } : {};

    return (
      <Autocomplete
        id="country-autocomplete"
        options={countries}
        getOptionLabel={(option) => option.name}
        value={selectedCountry || null}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'country',
              value: newValue ? newValue.id.toString() : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Country"
            variant="filled"
            fullWidth
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
    

      />
    );
  }
)
  


const StateAutocomplete = React.forwardRef(({ states, value, onChange, disabled, error, helperText, onKeyDown }, ref) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="state-autocomplete"
        options={states}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'state',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="State"
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      
      />
    </FormControl>
  );
 }
);

const ZoneAutocomplete = React.forwardRef(({ zones, value, onChange, disabled, error, helperText, onKeyDown }, ref) => {
  return (
    <FormControl fullWidth >
      <Autocomplete
        id="zone-autocomplete"
      
        options={zones}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'zone',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Zone"
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      />
    </FormControl>
  );
 }
);

const CityAutocomplete = React.forwardRef(({ cities, value, onChange, disabled, error, helperText, onKeyDown  }, ref) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="city-autocomplete"
        options={cities}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'city',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select City"
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      

      />
    </FormControl>
  );
 }
);

const InstituteAutocomplete = React.forwardRef(({ institutes, value, onChange, disabled, error, helperText, onKeyDown  }, ref) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="instituteName-autocomplete"
        options={institutes}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'instituteName',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <span>
                Select InstituteName <span style={{ color: 'red' }}>*</span>
              </span>
             }
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      

      />
    </FormControl>
  );
 }
);

const CourseAutocomplete = React.forwardRef(({ courses, value, onChange, disabled, error, helperText, onKeyDown }, ref) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="courseName-autocomplete"
        options={courses}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'courseName',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <span>
                Select CourseName <span style={{ color: 'red' }}>*</span>
              </span>
            }
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      

      />
    </FormControl>
  );
  }
);

const EmpTypeAutocomplete = React.forwardRef(({ types, value, onChange, disabled, error, helperText, onKeyDown }, ref) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        id="empTypeName-autocomplete"
        options={types}
        getOptionLabel={(option) => option.name}
        value={value}
        onChange={(event, newValue) => {
          onChange({
            target: {
              name: 'empTypeName',
              value: newValue ? newValue.id : ''
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <span>
                Select EmpTypeName <span style={{ color: 'red' }}>*</span>
              </span>
            }
            variant="filled"
            className="custom-textfield"
            error={!!error}
            helperText={helperText}
            inputRef={ref}
            onKeyDown={onKeyDown}
          />
        )}
        disabled={disabled}
        className="custom-select"
      

      />
    </FormControl>
  );
  }
);

export { CountryAutocomplete, StateAutocomplete, ZoneAutocomplete, CityAutocomplete, 
         InstituteAutocomplete, CourseAutocomplete, EmpTypeAutocomplete };