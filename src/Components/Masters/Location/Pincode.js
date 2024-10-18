import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CityAutocomplete } from '../../../Components/AutoComplete/AutoComplete'

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

const Pincode = () => {
  
  const [formData, setFormData] = useState({
    pinCode: '',
    areaName: '',
    city: '',
    areaAbrv: '',
    stateName: ''
  });

  const [error, setError] = useState({
    pinCode: false,
    areaName: false,
    city: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [cities, setCities] = useState([]);
  const location = useLocation();
  const [currentPinId, setCurrentPinId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedPinId, setLastInsertedPinId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const pinCodeRef = useRef(null);
  const areaNameRef = useRef(null);
  const cityRef = useRef(null);
  const areaAbrvRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.pinId) {
      setCurrentPinId(location.state.pinId);
      fetchPincodeData(location.state.pinId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchPincodeData = async (id, flag) => {
    
    try {
      const response = await axios.post(`http://43.230.196.21/api/pincodeMst/RetrivepincodeMst`, {
        pinId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const pincodeData = response.data.data[0];
        setFormData({
          pinCode: pincodeData.pinCode,
          areaName: pincodeData.areaName,
          city: pincodeData.cityID.toString(),
          areaAbrv: pincodeData.areaAbrv,
          stateName: pincodeData.stateName
        });
        setIsFormDisabled(true);
        setCurrentPinId(pincodeData.pinId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch pincode data');
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
      toast.error('Error fetching pincode data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentPinId && currentPinId > 1) {
      await fetchPincodeData(currentPinId, "P");
    }
  };

  const handleNext = async () => {
    if (currentPinId) {
      await fetchPincodeData(currentPinId, "N");
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}PincodeMst/getcitydrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setCities(response.data.data);
        } else {
          toast.error('Failed to fetch cities');
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Error fetching cities. Please try again.');
      }
    };

    fetchCities();
  }, []);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));


    if (name === 'pincode') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'pincode' && value !== '') {
      setTimeout(() => {
        stateRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === pinCodeRef.current) {
        areaNameRef.current.focus();
      } else if (event.target === areaNameRef.current) {
        cityRef.current.focus();
      } else if (event.target === cityRef.current) {
        areaAbrvRef.current.focus();
      } else {
        stateRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

  if (!formData.pinCode) {
    toast.error('Pincode is required');
    setError(prev => ({ ...prev, pinCode: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, pinCode: false }));
  }

  if (!formData.areaName) {
    toast.error('Area name is required');
    setError(prev => ({ ...prev, areaName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, areaName: false }));
  }

  if (!formData.city) {
    toast.error('City is required');
    setError(prev => ({ ...prev, city: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, city: false }));
  }

  

  if (hasError) {
    return;
  }


    try {
      const payload = {
        pinCode: formData.pinCode,
        areaName: formData.areaName,
        cityID: parseInt(formData.city),
        areaAbrv: formData.areaAbrv,
        stateName: formData.stateName,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.pinId = currentPinId;
        response = await axios.patch('http://43.230.196.21/api/pincodeMst/UpdatepincodeMst', payload);
      } else {
        response = await axios.post('http://43.230.196.21/api/pincodeMst/InsertpincodeMst', payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedPinId(response.data.data)
          console.log(response.data.data)
          await fetchPincodeData(response.data.data);
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
          setCurrentPinId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating pincode:', error);
      toast.error('Error saving/updating pincode. Please try again.');
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
      pinCode: '',
      areaName: '',
      city: '',
      areaAbrv: '',
      stateName: ''
    });
    setCurrentPinId(null);

    setTimeout(() => {
      pinCodeRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchPincodeData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      pinCode: '',
      areaName: '',
      city: '',
      areaAbrv: '',
      stateName: ''
    });
    setCurrentPinId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/pincodetable')
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
      await fetchPincodeData(currentPinId, "D");
      // toast.success('Data deleted successfully');
      await fetchPincodeData(currentPinId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting pincode:', error);
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
                disabled={mode !== 'view' || !currentPinId || currentPinId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentPinId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3 style={{}}>Pincode Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentPinId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentPinId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentPinId || currentPinId === 1}
              >
                <DeleteIcon />
              </Button>
              {/* <h3 style={{ margin: 0 }}>City Master</h3> */}


              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentPinId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6} className='form_field'>
            <TextField
              id="pinCode"
              name="pinCode"
              label={
                <span>
                  Pincode <span style={{ color: 'red' }}>*</span>
                </span>
               }
              variant="filled"
              fullWidth
              className="custom-textfield"
              value={formData.pinCode}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.pinCode}
              helperText={error.pinCode ? '' : ''}
              inputRef={pinCodeRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            <TextField
              id="areaName"
              name="areaName"
              label="Area"
              variant="filled"
              fullWidth
              className="custom-textfield"
              value={formData.areaName}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.areaName}
              helperText={error.areaName ? '' : ''}
              inputRef={areaNameRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            {/* <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="custom-textfield"
                disabled={isFormDisabled}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <CityAutocomplete
              cities={cities}
              value={cities.find(city => city.id == formData.city) || null}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.city}
              helperText={error.city ? '' : ''}
              ref={cityRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            <TextField
              id="areaAbrv"
              name="areaAbrv"
              label="Area Abrv"
              variant="filled"
              fullWidth
              className="custom-textfield"
              value={formData.areaAbrv}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              inputRef={areaAbrvRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            <TextField
              id="stateName"
              name="stateName"
              label="State"
              variant="filled"
              fullWidth
              className="custom-textfield"
              value={formData.stateName}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              inputRef={stateRef}
            />
          </Grid>
          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }} onClick={handleEdit}
                  // disabled={!currentPinId} 
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

export default Pincode