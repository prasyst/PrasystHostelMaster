import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Button, TextField, Typography, Stepper, Step, StepLabel,
  FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import { FormLabel, RadioGroup, FormControlLabel, Radio, StepConnector } from '@mui/material';
import {useForm} from 'react-hook-form';

const PartyStepper1 = () => { 
  const {register , watch , reset , setValue} = useForm({ 
      PartyName : '',
  });
  
  const handleChange = (e)=>{
      console.log(e)
  }

 


    return ( 
        <Box sx={{ height: '350px', overflowY: 'scroll', padding: '16px' }}>
            <Grid container spacing={2}>
                <Grid container spacing={2}>
                    <Grid item lg={8} md={8} xs={12}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label={
                                            <span>
                                                Party Name <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        name="companyName"
                                        variant="filled"
                                        className="custom-textfield"
                                        {...register('PartyName')}                                     
                                    />
                                </Grid>
                                {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Alt Code"
                name="shortName"
                value={formData.shortName || ''}
                onChange={handleInputChange}
                variant="filled"
                disabled={isFormDisabled}
                className="custom-textfield"
              />
            </Grid> */}
                                {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label={
                  <span>
                    Abrv <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                name="jurisdiction"
                value={formData.jurisdiction || ''}
                onChange={handleInputChange}
                variant="filled"
                disabled={isFormDisabled}
                className="custom-textfield"
              />
            </Grid> */}
                                <Grid item xs={12} md={6}>
                                    <Grid container alignItems="center" spacing={2} sx={{ paddingLeft: '9px' }}>
                                        <Grid item>
                                            <FormLabel component="legend">GST Reg</FormLabel>
                                        </Grid>

                                        <Grid item>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    aria-label="gstReg"
                                                    name="gstReg"
                                                    row
                                                    {...register('gstReg')}
                                                    onChange={handleChange}      
                                                >
                                                    <FormControlLabel
                                                        value="RD"
                                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                                        label="RD"
                                                        className="custom-textfield"
                                                     
                                                    />
                                                    <FormControlLabel
                                                        value="URD"
                                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                                        label="URD"
                                                        className="custom-textfield"
                                                      
                                                    />
                                                    <FormControlLabel
                                                        value="composition"
                                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                                        label="Composition"
                                                        className="custom-textfield"
                                                       
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Alt Code"
                                        name="shortName"
                                        variant="filled"
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label={
                                            <span>
                                                Abrv <span style={{ color: 'red' }}>*</span>
                                            </span>
                                        }
                                        name="jurisdiction"
                                        variant="filled"                                
                                        className="custom-textfield"
                                    />
                                </Grid>
                                {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Alt Code"
                name="shortName"
                value={formData.shortName || ''}
                onChange={handleInputChange}
                variant="filled"
                disabled={isFormDisabled}
                className="custom-textfield"
              />
            </Grid> */}
                                {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label={
                  <span>
                    Abrv <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                name="jurisdiction"
                value={formData.jurisdiction || ''}
                onChange={handleInputChange}
                variant="filled"
                disabled={isFormDisabled}
                className="custom-textfield"
              />
            </Grid> */}
                                <Grid item xs={12} md={3} className='form_field'>
                                    <FormControl variant="filled" fullWidth className="custom-select">
                                        <InputLabel id="partyType-select-label">Party Type</InputLabel>
                                        <Select
                                            labelId="partyType-select-label"
                                            id="partyType-select"
                                            name="partyType"                                        
                                            className="custom-textfield"
                                        >
                                            <MenuItem value={10}>Supplier/Creditor</MenuItem>
                                            <MenuItem value={20}>Broker</MenuItem>
                                            <MenuItem value={30}>Transporter</MenuItem>
                                            <MenuItem value={40}>Others</MenuItem>
                                            <MenuItem value={50}>All</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} className='form_field'>
                                    <FormControl variant="filled" fullWidth className="custom-select">
                                        <InputLabel id="glControl-select-label">GL-Control A/C</InputLabel>
                                        <Select
                                            labelId="glControl-select-label"
                                            id="glControl-select"
                                            name="glControl"                                           
                                            className="custom-textfield"
                                        >
                                            <MenuItem value={10}>Sundry Creditor</MenuItem>
                                            <MenuItem value={20}>Sundry Dater</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item lg={12} md={12} xs={12}>
                                    <Box display="flex" gap={2}>
                                        <Grid item lg={8} md={8} xs={12}>
                                            <Box display="flex" flexDirection="column" gap={2}>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="Pincode"
                                                            name="totalRooms"                                                          
                                                            variant="filled"                                                         
                                                            className="custom-textfield"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6} className='form_field'>
                                                        <FormControl variant="filled" fullWidth className="custom-select">
                                                            <InputLabel id="areaName-select-label">Area</InputLabel>
                                                            <Select
                                                                labelId="areaName-select-label"
                                                                id="areaName-select"
                                                                name="areaName"                                                              
                                                                className="custom-textfield"
                                                            >
                                                                {/* {area.length > 0 ? (
                    area.map((areaItem) => (
                      <MenuItem key={areaItem.id} value={areaItem.name}>
                        {areaItem.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No areas available
                    </MenuItem>
                  )} */}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="City"
                                                            name="totalBeds"                                                          
                                                            variant="filled"                                                          
                                                            className="custom-textfield"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} md={6}>
                                                        <TextField
                                                            fullWidth
                                                            label="State"
                                                            name="totalBeds"                                                           
                                                            variant="filled"                                                         
                                                            className="custom-textfield"
                                                        />
                                                    </Grid>

                                                </Grid>

                                            </Box>
                                        </Grid>
                                        <Grid item spacing={1}>
                                            <Grid item xs={12} md={4} lg={4}>
                                                <TextField
                                                    fullWidth
                                                    label="Address"
                                                    name="propAdd"                                                    
                                                    multiline
                                                    rows={2}
                                                    variant="filled"                                                   
                                                    className="custom-textfield"
                                                    sx={{
                                                        '& .MuiInputBase-root': {
                                                            height: '112px',
                                                            width: '346px'
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            resize: 'vertical',
                                                        },
                                                        '& .MuiFilledInput-root': {
                                                            '&:hover': {
                                                                backgroundColor: 'transparent',
                                                            },
                                                            '&.Mui-focused': {
                                                                backgroundColor: 'transparent',
                                                            },
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>

                        </Box>

                    </Grid>



                    <Grid item lg={4} md={4} xs={12} display="flex" alignItems="center" justifyContent="center">
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid #ccc"
                            borderRadius={1}
                            width={150}
                            height={170}
                            overflow="hidden"
                            position="relative"
                            sx={{ cursor: 'pointer' }}
                        >
                            {/* {formData.photo ? (
                                <img
                                    src={formData.photo}
                                    alt="Logo"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Photo
                                </Typography>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, width: '100%', height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                }}
                            /> */}
                        </Box>
                    </Grid>

                    <Grid item lg={8} md={8} xs={12}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Grid item lg={12} md={12} xs={12}>
                                {/* <Grid container spacing={3}> */}
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="GST No"
                                                name="totalRooms"                                              
                                                variant="filled"                                              
                                                className="custom-textfield"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="PAN No"
                                                name="totalBeds"                                              
                                                variant="filled"                                               
                                                className="custom-textfield"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="TAN No"
                                                name="totalBeds"                                            
                                                variant="filled"                                               
                                                className="custom-textfield"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                            <TextField
                                                fullWidth
                                                label="IE Code"
                                                name="totalBeds"                                           
                                                variant="filled"                                              
                                                className="custom-textfield"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Tel No"
                                        name="totalBeds"                                      
                                        variant="filled"
                                     
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="totalBeds"                                       
                                        variant="filled"                                     
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Contact Person"
                                        name="totalBeds"                                      
                                        variant="filled"                                      
                                        className="custom-textfield"
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Mobile No"
                                        name="totalBeds"                                      
                                        variant="filled"                                     
                                        className="custom-textfield"
                                    />
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>

                    <Grid item display="flex" alignItems="center">

                        <Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <TextField
                                        fullWidth
                                        label="Work Address"
                                        name="propAdd"                                    
                                        multiline
                                        rows={2}
                                        variant="filled"                                     
                                        className="custom-textfield"
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                height: '100px',
                                                width: '340px'
                                            },
                                            '& .MuiInputBase-input': {
                                                resize: 'vertical',
                                            },
                                            '& .MuiFilledInput-root': {
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: 'transparent',
                                                },
                                            },
                                        }}
                                    />
                                </Grid>

                            </Grid>
                        </Box>

                    </Grid>

                    <Grid item lg={12} md={12} xs={12}>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Grid container alignItems="center" spacing={2} sx={{ paddingLeft: '9px' }}>
                                        <Grid item>
                                            <FormLabel component="legend">MSME Reg</FormLabel>
                                        </Grid>

                                        <Grid item>
                                            <FormControl component="fieldset">
                                                <RadioGroup
                                                    aria-label="msmeReg"
                                                    name="msmeReg"
                                                    // value={formData.msmeReg}
                                                    // onChange={inputChangeHandler}
                                                    row
                                                >
                                                    <FormControlLabel
                                                        value="yes"
                                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                                        label="Yes"
                                                        className="custom-textfield"
                                                        // disabled={isFormDisabled}
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                                                        label="No"
                                                        className="custom-textfield"
                                                        // disabled={isFormDisabled}
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                </Grid>

                                <Grid item xs={12} md={3} className='form_field'>
                                    <FormControl variant="filled" fullWidth className="custom-select">
                                        <InputLabel id="areaName-select-label">MSME Act</InputLabel>
                                        <Select
                                            labelId="areaName-select-label"
                                            id="areaName-select"
                                            name="areaName"
                                            // value={formData.areaName}
                                            // onChange={handleInputChange}
                                            className="custom-textfield"
                                        >
                                            <MenuItem value={10}>Not Register</MenuItem>
                                            <MenuItem value={20}>Mfr</MenuItem>
                                            <MenuItem value={30}>Trader</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={3} className='form_field'>
                                    <FormControl variant="filled" fullWidth className="custom-select">
                                        <InputLabel id="areaName-select-label">MSME Trade</InputLabel>
                                        <Select
                                            labelId="areaName-select-label"
                                            id="areaName-select"
                                            name="areaName"
                                            // value={formData.areaName}
                                            // onChange={handleInputChange}
                                            className="custom-textfield"
                                        >
                                            <MenuItem value={10}>Not Register</MenuItem>
                                            <MenuItem value={20}>Goods</MenuItem>
                                            <MenuItem value={30}>Service</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3} className='form_field'>
                                    <FormControl variant="filled" fullWidth className="custom-select">
                                        <InputLabel id="areaName-select-label">MSME Class</InputLabel>
                                        <Select
                                            labelId="areaName-select-label"
                                            id="areaName-select"
                                            name="areaName"
                                            // value={formData.areaName}
                                            // onChange={handleInputChange}
                                            className="custom-textfield"
                                        >
                                            <MenuItem value={30}>Not Register</MenuItem>
                                            <MenuItem value={10}>Medium</MenuItem>
                                            <MenuItem value={20}>Micro/Small</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                    </Grid>
                </Grid>

            </Grid>
        </Box>
    )
}

export default PartyStepper1
