import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
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
// import InputField from '../../../atoms/ComponentInput/InputField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AuthHeader from '../../../Auth';

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

const Country = () => {
  const [formData, setFormData] = useState({
    CountryName: '',
    CountryCode: '',
    ShortName: ''
  });

  const [error, setError] = useState({
    countryName: false,
    countryCode: false
  });
  
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [countryId, setCountryId] = useState(null);
  const location = useLocation();
  const [currentCountryId, setCurrentCountryId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedCountryId, setLastInsertedCountryId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const countryNameRef = useRef(null);
  const countryCodeRef = useRef(null);
  const shortNameRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.CountryId) {
      setCurrentCountryId(location.state.CountryId);
      fetchCountryData(location.state.CountryId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchCountryData = async (id, flag) => {
    try {
      const response = await axios.post('http://43.230.196.21/api/CountryMst/RetriveCountryMst', { 
        CountryId: parseInt(id),
        Flag: flag 
      },AuthHeader());
 
      if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
        const countryData = response.data.Data[0];
        setFormData({
          CountryName: countryData.CountryName, 
          CountryCode: countryData.CountryCode,
          ShortName: countryData.CountryAbrv
        });
        setIsFormDisabled(true);
        setCurrentCountryId(countryData.CountryId); 
      } else if (response.data.Status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.Message);
      } else {
        toast.error('Failed to fetch country data');
      }
    } catch (error) {
      console.error('Error fetching country data:', error);
      toast.error('Error fetching country data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentCountryId && currentCountryId > 1) {
      await fetchCountryData(currentCountryId, "P");
    }
  };

  const handleNext = async () => {
    if (currentCountryId) {
      await fetchCountryData(currentCountryId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'country') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'country' && value !== '') {
    setTimeout(() => {
      shortNameRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === countryCodeRef.current) {
      shortNameRef.current.focus();
    } else {
      countryCodeRef.current.focus();
    }
  }
};

const handleSave = async () => {
  
  let hasError = false;

  if (!formData.CountryName) {
    toast.error('Country name is required');
    setError(prev => ({ ...prev, CountryName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, CountryName: false }));
  }

  // if (!formData.countryCode) {
  //   toast.error('Country code is required');
  //   setError(prev => ({ ...prev, countryCode: true }));
  //   hasError = true;
  // } else if (!/^\+\d+$/.test(formData.countryCode) && !/^[A-Za-z]+$/.test(formData.countryCode)) {
  //   toast.error('Country code must be numeric or alphabetic characters');
  //   setError(prev => ({ ...prev, countryCode: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, countryCode: false }));
  // }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      CountryName: formData.CountryName,
      CountryCode: formData.CountryCode,
      CountryAbrv: formData.ShortName,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.CountryId = currentCountryId;
      response = await axios.patch('http://43.230.196.21/api/countryMst/UpdateCountryMaster', payload , AuthHeader());
    } else {
      response = await axios.post('http://43.230.196.21/api/countryMst/InsertCountryMaster', payload, AuthHeader());
    }

    if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.Message);
      if (mode === 'add') {
        setLastInsertedCountryId(response.data.Data)
        console.log(response.data.Data)
        await fetchCountryData(response.data.Data);
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
          setCurrentCountryId(response.data.Data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.Message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating country:', error);
    toast.error('Error saving/updating country. Please try again.');
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
      CountryName: '',
      CountryCode: '',
      ShortName: ''
    });
    setCurrentCountryId(null);

    setTimeout(() => {
      countryNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchCountryData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
      
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };
  

  const resetForm = () => {
    setFormData({
      CountryName: '',
      CountryCode: '',
      ShortName: ''
    });
    setCurrentCountryId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/countrytable')
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
      await fetchCountryData(currentCountryId, "D");
      // toast.success('Data deleted successfully');
      await fetchCountryData(currentCountryId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting country:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchCountryData(currentCountryId,"D")
  //      toast.success('Country deleted successfully');
  //      resetForm();
  //      setMode('add');
  //   }catch(error){
  //     toast.error('Error occurred while deleting. Please try again.');
  //   }
  //   };

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
            disabled={mode !== 'view' || !currentCountryId || currentCountryId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px'}}    
            className='three-d-button-next' 
            onClick={handleNext}
            disabled={mode !== 'view' || !currentCountryId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>Country Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentCountryId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentCountryId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentCountryId || currentCountryId === 1}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
      
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentCountryId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="CountryName"
               name="CountryName"
               label={
                <span>
                  Country <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.CountryName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.countryName}
               helperText={error.countryName && ""}
               inputRef={countryNameRef}
               onKeyDown={handleKeyPress}
              />
             </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="CountryCode"
                  name="CountryCode"
                  label="Country Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.CountryCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.countryCode}
                  helperText={error.countryCode && ""}
                  inputRef={countryCodeRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="ShortName"
                  name="ShortName"
                  label="Short Name"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.ShortName}
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
              // disabled={!currentCountryId}
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

export default Country;