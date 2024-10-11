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

const FacilitiesMaster = () => {
  const [formData, setFormData] = useState({
    facName: '',
    facDesc: '',
    remark: ''
  });

  const [error, setError] = useState({
    facName: false,
    facDesc: false,
    remark: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [facId, setFacId] = useState(null);
  const location = useLocation();
  const [currentFacId, setCurrentFacId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedFacId, setLastInsertedFacId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const facNameRef = useRef(null);
  const facDescRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.facId) {
      setCurrentFacId(location.state.facId);
      fetchFacilitiesMasterData(location.state.facId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchFacilitiesMasterData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}FacilitiesMst/RetriveFacilitiesMst`, { 
        facId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const facData = response.data.data[0];
        setFormData({
          facName: facData.facName, 
          facDesc: facData.facDesc, 
          remark: facData.remark
        });
        setIsFormDisabled(true);
        setCurrentFacId(facData.facId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch FacilitiesMaster data');
      }
    } catch (error) {
      console.error('Error fetching FacilitiesMaster data:', error);
      toast.error('Error fetching FacilitiesMaster data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentFacId && currentFacId > 1) {
      await fetchFacilitiesMasterData(currentFacId, "P");
    }
  };

  const handleNext = async () => {
    if (currentFacId) {
      await fetchFacilitiesMasterData(currentFacId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'facilitiesMaster') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'facilitiesMaster' && value !== '') {
    setTimeout(() => {
      remarkRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === facDescRef.current) {
      remarkRef.current.focus();
    } else {
      facDescRef.current.focus();
    }
  }
};


const handleSave = async () => {

  let hasError = false;

  if (!formData.facName) {
    toast.error('Fac Name is required');
    setError(prev => ({ ...prev, facName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, facName: false }));
  }

  // if (!formData.facDesc) {
  //   toast.error('Fac Desc is required');
  //   setError(prev => ({ ...prev, facDesc: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, facDesc: false }));
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
      facName: formData.facName,
      facDesc: formData.facDesc,
      remark: formData.remark,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.facId = currentFacId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}FacilitiesMst/UpdateFacilitiesMst`, payload);
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}FacilitiesMst/InsertFacilitiesMst`, payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedFacId(response.data.data)
        console.log(response.data.data)
        await fetchFacilitiesMasterData(response.data.data);
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
          setCurrentFacId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating facilitiesMaster:', error);
    toast.error('Error saving/updating facilitiesMaster. Please try again.');
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
      facName: '',
      facDesc: '',
      remark: ''
    });
    setCurrentFacId(null);

    setTimeout(() => {
      facNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchFacilitiesMasterData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      facName: '',
      facDesc: '',
      remark: ''
    });
    setCurrentFacId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/facilitiesMastertable')
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
      await fetchFacilitiesMasterData(currentFacId, "D");
      toast.success('Data deleted successfully');
      await fetchFacilitiesMasterData(currentFacId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting facilities master:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchFacilitiesMasterData(currentFacId,"D")
  //      toast.success('FacilitiesMaster deleted successfully');
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
            disabled={mode !== 'view' || !currentFacId || currentFacId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentFacId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>Facilities Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentFacId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentFacId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentFacId || currentFacId === 1}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentFacId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="facName"
               name="facName"
               label={
                <span>
                  Fac Name <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.facName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.facName}
               helperText={error.facName && ""}
               inputRef={facNameRef}
               onKeyDown={handleKeyPress}
              />
             </Grid>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="facDesc"
               name="facDesc"
               label="Fac Desc"
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.facDesc}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.facDesc}
               helperText={error.facDesc && ""}
               inputRef={facDescRef}
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
                  error={error.remark}
                  helperText={error.remark && ""}
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

export default FacilitiesMaster