import React, { useEffect, useState } from 'react'
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
import { useParams, useNavigate ,useLocation} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { CountryAutocomplete } from '../../../Components/AutoComplete/AutoComplete'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

const State = () => {
  
  const [formData, setFormData] = useState({
    country: '',
    stateName: '',
    stateCode: '',
    shortName: ''
  });

  const [error, setError] = useState({
    country: false,
    stateName: false,
    stateCode: false
  });

  const navigate = useNavigate();
  
  const [countries, setCountries] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [countryIds, setCountryIds] = useState([]);
  const [stateId, setStateId] = useState(null);
  const location = useLocation();
  const [currentStateId, setCurrentStateId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedStateId, setLastInsertedStateId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const countryRef = useRef(null);
  const stateNameRef = useRef(null);
  const stateCodeRef = useRef(null);
  const shortNameRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.stateId) {
      setCurrentStateId(location.state.stateId);
      fetchStateData(location.state.stateId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchStateData = async (id, flag) => {
    debugger
    try {
      const response = await axios.post('http://43.230.196.21/api/stateMst/RetrivestateMst', { 
        stateId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const stateData = response.data.data[0];
        setFormData({
          country: stateData.countryId.toString(), 
          stateName: stateData.stateName,
          stateCode: stateData.stateCode,
          shortName: stateData.stateAbrv
        });
        setIsFormDisabled(true);
        setCurrentStateId(stateData.stateId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch state data');
      }
    } catch (error) {
      console.error('Error fetching state data:', error);
      toast.error('Error fetching state data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentStateId && currentStateId > 1) {
      await fetchStateData(currentStateId, "P");
    }
  };

  const handleNext = async () => {
    if (currentStateId) {
      await fetchStateData(currentStateId, "N");
    }
  };
  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}StateMst/getcountydrp`);
        setCountries(response.data.data);
        const idMapping = response.data.data.reduce((acc, country) => {
          acc[country.name] = country.id;
          return acc;
        }, {});
        setCountryIds(idMapping);
      } catch (err) {
        console.log(err);
      }
    };
    getCountries();
  }, []);


const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'state') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'state' && value !== '') {
    setTimeout(() => {
      shortNameRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === countryRef.current) {
      stateNameRef.current.focus();
    } else if (event.target === stateNameRef.current) {
      stateCodeRef.current.focus();
    }else {
      shortNameRef.current.focus();
    }
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.country) {
    toast.error('Country name is required');
    setError(prev => ({ ...prev, country: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, country: false }));
  }

  if (!formData.stateName) {
    toast.error('State name is required');
    setError(prev => ({ ...prev, stateName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, stateName: false }));
  }

  // if (!formData.stateCode) {
  //   toast.error('State code is required');
  //   setError(prev => ({ ...prev, stateCode: true }));
  //   hasError = true;
  // } else if (!/^[0-9]+$/.test(formData.stateCode)) {
  //   toast.error('State code must be numeric characters');
  //   setError(prev => ({ ...prev, stateCode: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, stateCode: false }));
  // }

  if (hasError) {
    return;
  }
  
  try {
    const payload = {
      countryId: parseInt(formData.country),
      stateName: formData.stateName,
      stateCode: formData.stateCode,
      stateAbrv: formData.shortName,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.stateId = currentStateId;
      response = await axios.patch('http://43.230.196.21/api/stateMst/UpdatestateMst', payload);
    } else {
      response = await axios.post('http://43.230.196.21/api/stateMst/InsertstateMst', payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedStateId(response.data.data)
        console.log(response.data.data)
        await fetchStateData(response.data.data);
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
          setCurrentStateId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating state:', error);
    toast.error('Error saving/updating state. Please try again.');
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
      country: '',
      stateName: '',
      stateCode: '',
      shortName: ''
    });
    setCurrentStateId(null);

    setTimeout(() => {
      countryRef.current?.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchStateData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      country: '',
      stateName: '',
      cityCode: '',
      shortName: ''
    });
    setCurrentStateId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/statetable')
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
      await fetchStateData(currentStateId, "D");
      // toast.success('Data deleted successfully');
      await fetchStateData(currentStateId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting state:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchStateData(currentStateId,"D")
  //      toast.success('State deleted successfully');
  //      resetForm();
  //      setMode('add');
  //   }catch(error){
  //     toast.error('Error occurred while deleting. Please try again.');
  //   }
  // };

  return (
    <>

      <Box className="form-container">
   
      <ToastContainer />
        <Grid container spacing={2} className='form_grid'>
        <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent:'space-between', marginTop: '20px' }}>
          <Grid>
          <Button 
            variant="contained" 
            size="small" 
            className='three-d-button-previous'
            onClick={handlePrevious}
            disabled={mode !== 'view' || !currentStateId || currentStateId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px'}}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentStateId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>State Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentStateId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentStateId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentStateId || currentStateId === 1}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>City Master</h3> */}
        
      
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentStateId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
    
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            {/* <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                labelId="country-select-label"
                id="country-select"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="custom-textfield"
                disabled={isFormDisabled}
                inputRef={countryRef}
                onKeyDown={handleKeyPress}
              >
                {countries.map((country) => (
                
                  <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <CountryAutocomplete
              countries={countries}
              value={formData.country}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.country}
              helperText={error.country ? '' : ''}
              ref={countryRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
              <Grid item xs={12} md={6} lg={6}>
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
                  error={error.stateName}
                  helperText={error.stateName && ""}
                  inputRef={stateNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="stateCode"
                  name="stateCode"
                  label="State Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.stateCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.stateCode}
                  helperText={error.stateCode && ""}
                  inputRef={stateCodeRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="shortName"
                  name="shortName"
                  label="Short Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={shortNameRef}
                />
              </Grid>
            </Grid>
          </Grid>

        <Grid item xs={12} className="form_button">
          {mode === 'view' && (
            <>
              <Button variant="contained" sx={{ mr: 1 , background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                Submit
              </Button>
              <Button variant="contained" sx={{ mr: 1 , background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit} 
              // disabled={!currentStateId}
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

export default State