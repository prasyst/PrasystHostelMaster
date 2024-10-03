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

const PropertyType = () => {
  const [formData, setFormData] = useState({
    propType: '',
    propType_Desc: '',
    remark: ''
  });

  const [error, setError] = useState({
    propType: false,
    propType_Desc: false,
    remark: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [propTypeId, setPropTypeId] = useState(null);
  const location = useLocation();
  const [currentPropTypeId, setCurrentPropTypeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedPropTypeId, setLastInsertedPropTypeId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const propTypeRef = useRef(null);
  const propType_DescRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.propTypeId) {
      setCurrentPropTypeId(location.state.propTypeId);
      fetchPropertyTypeData(location.state.propTypeId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchPropertyTypeData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}PropTypeMst/RetrivePropTypeMst`, { 
        propTypeId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const propertyTypeData = response.data.data[0];
        setFormData({
          propType: propertyTypeData.propType, 
          propType_Desc: propertyTypeData.propType_Desc,
          remark: propertyTypeData.remark
        });
        setIsFormDisabled(true);
        setCurrentPropTypeId(propertyTypeData.propTypeId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch propertyType data');
      }
    } catch (error) {
      console.error('Error fetching propertyType data:', error);
      toast.error('Error fetching propertyType data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentPropTypeId && currentPropTypeId > 1) {
      await fetchPropertyTypeData(currentPropTypeId, "P");
    }
  };

  const handleNext = async () => {
    if (currentPropTypeId) {
      await fetchPropertyTypeData(currentPropTypeId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));

  if (name === 'propertyType') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'propertyType' && value !== '') {
    setTimeout(() => {
      remarkRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === propType_DescRef.current) {
      remarkRef.current.focus();
    } else {
      propType_DescRef.current.focus();
    }
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.propType) {
    toast.error('PropertyType is required');
    setError(prev => ({ ...prev, propType: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, propType: false }));
  }

  // if (!formData.propType_Desc) {
  //   toast.error('Description is required');
  //   setError(prev => ({ ...prev, propType_Desc: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, propType_Desc: false }));
  // }

  // if (!formData.remark) {
  //   toast.error('Description is required');
  //   setError(prev => ({ ...prev, remark: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, remark: false }));
  // }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      propType: formData.propType,
      propType_Desc: formData.propType_Desc,
      remark: formData.remark,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.propTypeId = currentPropTypeId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}PropTypeMst/UpdatePropTypeMst`, payload);
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}PropTypeMst/InsertPropTypeMst`, payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedPropTypeId(response.data.data)
        console.log(response.data.data)
        await fetchPropertyTypeData(response.data.data);
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
          setCurrentPropTypeId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating propertyType:', error);
    toast.error('Error saving/updating propertyType. Please try again.');
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
      propType: '',
      propType_Desc: '',
      remark: ''
    });
    setCurrentPropTypeId(null);

    setTimeout(() => {
      propTypeRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchPropertyTypeData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      propType: '',
      propType_Desc: '',
      remark: ''
    });
    setCurrentPropTypeId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/propertyTypetable')
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
      await fetchPropertyTypeData(currentPropTypeId, "D");
      await fetchPropertyTypeData(currentPropTypeId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting propertyType:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchFloorData(currentFloorId,"D")
  //      toast.success('Floor deleted successfully');
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
            disabled={mode !== 'view' || !currentPropTypeId || currentPropTypeId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentPropTypeId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>PropertyType Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentPropTypeId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentPropTypeId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentPropTypeId || currentPropTypeId === 0}
          >
            <DeleteIcon />
          </Button>
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentPropTypeId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="propType"
               name="propType"
               label={
                <span>
                  PropType <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.propType}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.propType}
               helperText={error.propType  && ""}
               inputRef={propTypeRef}
               onKeyDown={handleKeyPress}
              />
             </Grid>
             <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="propType_Desc"
                  name="propType_Desc"
                  label="Description"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.propType_Desc}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={propType_DescRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="remark"
                  name="remark"
                  label="Remark"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.remark}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  inputRef={remarkRef}
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

export default PropertyType;