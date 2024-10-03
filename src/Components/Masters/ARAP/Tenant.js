import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    backgroundColor: 'transparent',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
  },
  '& .Mui-focused': {
    borderColor: '#673ab7',
  },
  '& .MuiFilledInput-root.Mui-focused': {
    border: '1px solid #673ab7',
  },
}));

const Tenant = () => {
  const [formData, setFormData] = useState({
    tenant: '',
    tenantCode: '',
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    mobileNo: '',
    alternateMobile: '',
    emailID: '',
    aadharNo: '',
    panNo: '',
    pinCode: '',
    country: '',
    state: '',
    city: '',
    parent: '',
    relation: '',
    occupation: '',
    instituteName: '',
    courseName: '',
    semester: '',
    designation: '',
    isinhostle: '',
    hostle: ''
  });
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const location = useLocation();
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');


  const handlePrevious = async () => {

  };

  const handleNext = async () => {

  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));


    if (name === 'tenant') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        tenant: '',
        tenantCode: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        dateOfBirth: '',
        mobileNo: '',
        alternateMobile: '',
        emailID: '',
        aadharNo: '',
        panNo: '',
        pinCode: '',
        country: '',
        state: '',
        city: '',
        parent: '',
        relation: '',
        occupation: '',
        instituteName: '',
        courseName: '',
        semester: '',
        designation: '',
        isinhostle: '',
        hostle: '',
        status: "1"
      };

      let response;
      if (mode === 'edit') {

        response = await axios.patch('', payload);
      } else {
        response = await axios.post('', payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          console.log(response.data.data)
          // setFormData({
          //   country: '',
          //   state: '',
          //   zone: '',
          //   city: '',
          //   shortName: '',
          //   cityCode: ''
          // });
          setMode('view');
          setIsFormDisabled(true);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating tenant:', error);
      toast.error('Error saving/updating tenant. Please try again.');
    }
  };


  const handleEdit = () => {
    setMode('edit');
    setIsFormDisabled(false);
  };

  const handleAdd = () => {
    setMode('add');
    setIsFormDisabled(false);
    setFormData({
      tenant: '',
      tenantCode: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      mobileNo: '',
      alternateMobile: '',
      emailID: '',
      aadharNo: '',
      panNo: '',
      pinCode: '',
      country: '',
      state: '',
      city: '',
      parent: '',
      relation: '',
      occupation: '',
      instituteName: '',
      courseName: '',
      semester: '',
      designation: '',
      isinhostle: '',
      hostle: ''
    });
  };

  const handleCancel = async () => {
    try {
      if ('') {

      } else {

        setFormData({
          tenant: '',
          tenantCode: '',
          firstName: '',
          middleName: '',
          lastName: '',
          gender: '',
          dateOfBirth: '',
          mobileNo: '',
          alternateMobile: '',
          emailID: '',
          aadharNo: '',
          panNo: '',
          pinCode: '',
          country: '',
          state: '',
          city: '',
          parent: '',
          relation: '',
          occupation: '',
          instituteName: '',
          courseName: '',
          semester: '',
          designation: '',
          isinhostle: '',
          hostle: ''
        });
      }

      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      console.error('Error fetching tenant data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      tenant: '',
      tenantCode: '',
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      mobileNo: '',
      alternateMobile: '',
      emailID: '',
      aadharNo: '',
      panNo: '',
      pinCode: '',
      country: '',
      state: '',
      city: '',
      parent: '',
      relation: '',
      occupation: '',
      instituteName: '',
      courseName: '',
      semester: '',
      designation: '',
      isinhostle: '',
      hostle: ''
    });
    setMode('view');
  };

  const handleExit = () => {
    navigate('/tenanttable')
  }

  const handleDelete = async () => {
    try {
      const res = await axios.post('', {});
      console.log('dele', res.data)
      if (res.data.status === 0 && res.data.responseStatusCode === 1) {
        toast.error('Data Deleted successfully');
        resetForm();
        setMode('add');
      } else {
        toast.error('Failed to delete tenant');
      }
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };

  return (
    <>

      <Box className="form-container">

        <ToastContainer />
        <Grid container spacing={2} className='form_grid'>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                className='three-d-button-previous'
                onClick={handlePrevious}
                disabled={''}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={''}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3 style={{}}>Tenant Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={''}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={''}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDelete}
                disabled={''}
              >
                <DeleteIcon />
              </Button>
              {/* <h3 style={{ margin: 0 }}>City Master</h3> */}


              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={''}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="filled" fullWidth className="custom-select">
                  <InputLabel id="tenant-select-label">Tenant Type</InputLabel>
                  <Select
                    labelId="tenant-select-label"
                    id="tenant-select"
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleInputChange}
                    className="custom-textfield"
                    disabled={isFormDisabled}
                  >
                    <MenuItem value={''}>Student</MenuItem>
                    <MenuItem value={''}>Working</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="tenantCode"
                  name="tenantCode"
                  label="Tenant Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.tenantCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="middleName"
                  name="middleName"
                  label="Middle Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <FormControl variant="filled" fullWidth className="custom-select">
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    id="gender-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="custom-textfield"
                    disabled={isFormDisabled}
                  >
                    <MenuItem value={''}>Male</MenuItem>
                    <MenuItem value={''}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="dateOfBirth"
                  name="dateOfBirth"
                  label="Date Of Birth"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  id="mobileNo"
                  name="mobileNo"
                  label="Mobile No"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="alternateMobile"
                  name="alternateMobile"
                  label="Alternate Mobile"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.alternateMobile}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="emailID"
                  name="emailID"
                  label="Email ID"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.emailID}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="aadharNo"
                  name="aadharNo"
                  label="Aadhar No"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.aadharNo}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="panNo"
                  name="panNo"
                  label="Pan No"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="pinCode"
                  name="pinCode"
                  label="Pin Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="country"
                  name="country"
                  label="Country"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="state"
                  name="state"
                  label="State"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="city"
                  name="city"
                  label="City"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="parent"
                  name="parent"
                  label="Parent/Spouse"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.parent}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="relation"
                  name="relation"
                  label="Relation"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.relation}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="occupation"
                  name="occupation"
                  label="Occupation"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="instituteName"
                  name="instituteName"
                  label="Institute Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="courseName"
                  name="courseName"
                  label="Course Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="semester"
                  name="semester"
                  label="Semester"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.semester}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="designation"
                  name="designation"
                  label="Designation"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.designation}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} className='form_field'>
                <FormControl variant="filled" fullWidth className="custom-select">
                  <InputLabel id="isinhostle-select-label">Is in Hostle</InputLabel>
                  <Select
                    labelId="isinhostle-select-label"
                    id="isinhostle-select"
                    name="isinhostle"
                    value={formData.isinhostle}
                    onChange={handleInputChange}
                    className="custom-textfield"
                    disabled={isFormDisabled}
                  >
                    <MenuItem value={''}>Yes</MenuItem>
                    <MenuItem value={''}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="hostle"
                  name="hostle"
                  label="Hostle"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.hostle}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }} onClick={handleEdit}
                  // disabled={!currentCityId}
                  disabled
                >
                  Cancel
                </Button>
              </>
            )}
            {(mode === 'edit' || mode === 'add') && (
              <>

                <Button variant="contained" sx={{ mr: 1 }} onClick={handleSave} >
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1 }} onClick={handleCancel}>
                  Cancel
                </Button>

              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Tenant
