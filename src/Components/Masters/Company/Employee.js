import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { EmpTypeAutocomplete } from '../../../Components/AutoComplete/AutoComplete'

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

const EmployeeMaster = () => {
  const [formData, setFormData] = useState({
    empTypeName: '',
    empName: '',
    mobile: '',
    email: '',
    panNo: '',
    pinCode: '',
    permanentAddr: '',
    currentAddr: '',
    photo: ''
  });

  const [error, setError] = useState({
    empTypeName: false,
    empName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [empId, setEmpId] = useState(null);
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState(null);
  const [types, setTypes] = useState([]);
  const [empTypeNames, setEmpTypeNames] = useState([]);
  const location = useLocation();
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedEmployeeId, setLastInsertedEmployeeId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const empTypeNameRef = useRef(null);
  const empNameRef = useRef(null);
  const mobileRef = useRef(null);
  const emailRef = useRef(null);
  const panNoRef = useRef(null);
  const pinCodeRef = useRef(null);
  const permanentAddrRef = useRef(null);
  const currentAddrRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      // Use a Promise to handle the file reading
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result); // This will be the Base64 string
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };
  
      // Read the file and update the state
      readFileAsBase64(file)
        .then(base64String => {
          setFormData(prevData => ({
            ...prevData,
            photo: base64String
          }));
        })
        .catch(err => {
          console.error('Error reading file:', err);
          toast.error('Error reading file. Please try again.');
        });
    }
  };

  useEffect(() => {
    if (location.state && location.state.empId) {
      setCurrentEmployeeId(location.state.empId);
      fetchEmpData(location.state.empId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchEmpData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmp/RetriveMstEmp`, {
        empId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const empData = response.data.data[0];
        setFormData({
          empTypeName: empData.empTypeId.toString(),
          // empTypeName: empData.empTypeName,
          empName: empData.empName,
          mobile: empData.mobile,
          email: empData.email,
          panNo: empData.panNo,
          pinCode: empData.pinId.toString(),
          permanentAddr: empData.permanentAddr,
          currentAddr: empData.currentAddr,
          photo: empData.photo
        });
        setIsFormDisabled(true);
        setCurrentEmployeeId(empData.empId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch employee data');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error('Error fetching employee data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchEmpTypes = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmpType/getMstEmpTypedrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setTypes(response.data.data);
        } else {
          toast.error('Failed to fetch empTypes');
        }
      } catch (error) {
        console.error('Error fetching empTypes:', error);
        toast.error('Error fetching empTypes. Please try again.');
      }
    };

    fetchEmpTypes();
  }, []);

  const handlePrevious = async () => {
    if (currentEmployeeId && currentEmployeeId > 1) {
      await fetchEmpData(currentEmployeeId, "P");
    }
  };

  const handleNext = async () => {
    if (currentEmployeeId) {
      await fetchEmpData(currentEmployeeId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'employee') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'employee' && value !== '') {
      setTimeout(() => {
        currentAddrRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === empTypeNameRef.current) {
        empNameRef.current.focus();
      } else if (event.target === empNameRef.current){
        mobileRef.current.focus();
      }else if (event.target === mobileRef.current){
        emailRef.current.focus();
      }else if (event.target === emailRef.current){
        panNoRef.current.focus();
      } else if (event.target === panNoRef.current){
        pinCodeRef.current.focus();
      } else if (event.target === pinCodeRef.current){
        permanentAddrRef.current.focus();
      } else {
        currentAddrRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

    if (!formData.empTypeName) {
      toast.error('EmployeeType Name is required');
      setError(prev => ({ ...prev, empTypeName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, empTypeName: false }));
    }

    if (!formData.empName) {
      toast.error('Employee Name is required');
      setError(prev => ({ ...prev, empName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, empName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        empTypeId: parseInt(formData.empTypeName),
        // empTypeName: formData.empTypeName,
        empName: formData.empName,
        mobile: formData.mobile,
        email: formData.email,
        panNo: formData.panNo,
        pinId: parseInt(formData.pinCode),
        permanentAddr: formData.permanentAddr,
        currentAddr: formData.currentAddr,
        photo: formData.photo,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.empId = currentEmployeeId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}MstEmp/UpdateMstEmp`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}MstEmp/InsertMstEmp`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedEmployeeId(response.data.data)
          console.log(response.data.data)
          await fetchEmpData(response.data.data);
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
          setCurrentEmployeeId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating employee:', error);
      toast.error('Error saving/updating employee. Please try again.');
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
      empTypeName: '',
      empName: '',
      mobile: '',
      email: '',
      panNo: '',
      pinCode: '',
      permanentAddr: '',
      currentAddr: '',
      photo: ''
    });
    setCurrentEmployeeId(null);

    setTimeout(() => {
      empTypeNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchEmpData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      empTypeName: '',
      empName: '',
      mobile: '',
      email: '',
      panNo: '',
      pinCode: '',
      permanentAddr: '',
      currentAddr: '',
      photo: ''
    });
    setCurrentEmployeeId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/employeetable')
  }

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleConfirmDelete = async () => {
    setOpenConfirmDialog(false);
    try {
      await fetchEmpData(currentEmployeeId, "D");
      await fetchEmpData(currentEmployeeId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting employee:', error);
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
                disabled={mode !== 'view' || !currentEmployeeId || currentEmployeeId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentEmployeeId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Employee Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentEmployeeId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentEmployeeId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentEmployeeId || currentEmployeeId === 0}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentEmployeeId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          {/* <Grid container spacing={2}> */}
          {/* <Grid container spacing={2}> */}
          <Grid item lg={8} md={8} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid item lg={12} md={12} xs={12}>
                {/* <Grid container spacing={3}> */}
                <Box display="flex" flexDirection="column" gap={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} className='form_field'>
                      {/* <FormControl variant="filled" fullWidth className="custom-select">
                        <InputLabel id="empTypeName-select-label">EmpTypeName</InputLabel>
                        <Select
                          labelId="empTypeName-select-label"
                          id="empTypeName-select"
                          name="empTypeName"
                          value={formData.empTypeName}
                          onChange={handleInputChange}
                          className="custom-textfield"
                        >
                          {types.map((empTypeName) => (
                            <MenuItem key={empTypeName.id} value={empTypeName.id}>
                             {empTypeName.name}
                            </MenuItem>
                           ))} 
                        </Select>
                      </FormControl> */}
                      <EmpTypeAutocomplete
                        types={types}
                        value={types.find(empTypeName => empTypeName.id == formData.empTypeName) || null}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        error={error.empTypeName}
                        helperText={error.empTypeName ? '' : ''}
                        ref={empTypeNameRef}
                        onKeyDown={handleKeyPress}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <TextField
                        id="empName"
                        name="empName"
                        label={
                          <span>
                            EmpName <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        variant="filled"
                        fullWidth
                        className="custom-textfield"
                        value={formData.empName}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        inputRef={empNameRef}
                        onKeyDown={handleKeyPress}
                      />
                    </Grid>
                  </Grid>
                </Box>

              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="mobile"
                    name="mobile"
                    label="Mobile"
                    variant="filled"
                    fullWidth
                    className="custom-textfield"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    inputRef={mobileRef}
                    onKeyDown={handleKeyPress}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="filled"
                    fullWidth
                    className="custom-textfield"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    inputRef={emailRef}
                    onKeyDown={handleKeyPress}
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
                    inputRef={panNoRef}
                    onKeyDown={handleKeyPress}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="pinCode"
                    name="pinCode"
                    label="Pincode"
                    variant="filled"
                    fullWidth
                    className="custom-textfield"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    inputRef={pinCodeRef}
                    onKeyDown={handleKeyPress}
                  />
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
              gap={2}
              border="1px solid #ccc"
              borderRadius={1}
              width={130}
              height={150}
              overflow="hidden"
              position="relative"
            >
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Uploaded Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: 'center' }}
                >
                  Photo
                </Typography>
              )}
            </Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              disabled={isFormDisabled}
              id="upload-photo"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="upload-photo">
              <Button
                // variant="contained"
                component="span"
                style={{ marginTop: '5px' }}
              >
                Upload Image
              </Button>
            </label>
          </Grid>
          <Grid item lg={12} md={12} xs={12}>

            <Box display="flex" flexDirection="column" gap={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label="Permanent Address"
                    name="permanentAddr"
                    value={formData.permanentAddr || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    variant="filled"
                    disabled={isFormDisabled}
                    inputRef={permanentAddrRef}
                    onKeyDown={handleKeyPress}
                    className="custom-textfield"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '115px',
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
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label="Current Address"
                    name="currentAddr"
                    value={formData.currentAddr || ''}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    variant="filled"
                    disabled={isFormDisabled}
                    inputRef={currentAddrRef}
                    onKeyDown={handleKeyPress}
                    className="custom-textfield"
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '115px',
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
          {/* </Grid> */}

          {/* </Grid> */}

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit}
                  // disabled={!currentZoneId}
                  disabled
                >
                  Cancel
                </Button>
              </>
            )}
            {(mode === 'edit' || mode === 'add') && (
              <>

                <Button variant="contained" sx={{ mr: 1 }} onClick={handleSave}>
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: '#635BFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: 'white'
              }
            }}
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
          <Button
            sx={{
              backgroundColor: '#635BFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
                color: 'white'
              }
            }}
            onClick={handleCloseConfirmDialog}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmployeeMaster