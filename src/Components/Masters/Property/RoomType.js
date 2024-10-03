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

const RoomType = () => {
  const [formData, setFormData] = useState({
    roomTypeName: '',
    remark: ''
  });

  const [error, setError] = useState({
    roomTypeName: false,
    remark: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [roomTypeId, setRoomTypeId] = useState(null);
  const location = useLocation();
  const [currentRoomTypeId, setCurrentRoomTypeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedRoomTypeId, setLastInsertedRoomTypeId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const roomTypeNameRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.roomTypeId) {
      setCurrentRoomTypeId(location.state.roomTypeId);
      fetchRoomTypeData(location.state.roomTypeId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchRoomTypeData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}RoomTypeMst/RetriveRoomTypeMst`, { 
        roomTypeId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const roomTypeData = response.data.data[0];
        setFormData({
          roomTypeName: roomTypeData.roomTypeName, 
          remark: roomTypeData.remark
        });
        setIsFormDisabled(true);
        setCurrentRoomTypeId(roomTypeData.roomTypeId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch room type data');
      }
    } catch (error) {
      console.error('Error fetching room type data:', error);
      toast.error('Error fetching room type data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentRoomTypeId && currentRoomTypeId > 1) {
      await fetchRoomTypeData(currentRoomTypeId, "P");
    }
  };

  const handleNext = async () => {
    if (currentRoomTypeId) {
      await fetchRoomTypeData(currentRoomTypeId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'roomtype') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'roomtype' && value !== '') {
    setTimeout(() => {
      remarkRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    remarkRef.current.focus();
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.roomTypeName) {
    toast.error('Room Type Name is required');
    setError(prev => ({ ...prev, roomTypeName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, roomTypeName: false }));
  }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      roomTypeName: formData.roomTypeName,
      remark: formData.remark,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.roomTypeId = currentRoomTypeId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}RoomTypeMst/UpdateRoomTypeMst`, payload);
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}RoomTypeMst/InsertRoomTypeMst`, payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedRoomTypeId(response.data.data)
        console.log(response.data.data)
        await fetchRoomTypeData(response.data.data);
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
          setCurrentRoomTypeId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating room type:', error);
    toast.error('Error saving/updating room type. Please try again.');
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
      roomTypeName: '',
      remark: ''
    });
    setCurrentRoomTypeId(null);

    setTimeout(() => {
      roomTypeNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchRoomTypeData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      roomTypeName: '',
      remark: ''
    });
    setCurrentRoomTypeId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/roomTypetable')
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
      await fetchRoomTypeData(currentRoomTypeId, "D");
      // toast.success('Data deleted successfully');
      await fetchRoomTypeData(currentRoomTypeId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting roomtype:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchRoomTypeData(currentRoomTypeId,"D")
  //      toast.success('Room Type deleted successfully');
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
            disabled={mode !== 'view' || !currentRoomTypeId || currentRoomTypeId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentRoomTypeId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>RoomType Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentRoomTypeId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentRoomTypeId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentRoomTypeId || currentRoomTypeId === 0}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentRoomTypeId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="roomTypeName"
               name="roomTypeName"
               label={
                <span>
                  RoomType <span style={{ color: 'red' }}>*</span>
                </span>
               }
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.roomTypeName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.roomTypeName}
               helperText={error.roomTypeName && ""}
               inputRef={roomTypeNameRef}
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

export default RoomType