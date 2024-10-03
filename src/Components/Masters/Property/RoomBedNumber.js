import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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

const RoomBedNumber = () => {
  
  const [formData, setFormData] = useState({
    roomId: '',
    roombedName: '',
    remark: ''
  });

  const [error, setError] = useState({
    roomId: false,
    roombedName: false,
    remark: false
  });

  const navigate = useNavigate();


  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [roomBedId, setRoomBedId] = useState(null);
  const location = useLocation();
  const [currentRoomBedId, setCurrentRoomBedId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [roomId, setRoomId] = useState([])
  const [lastInsertedRoomBedId, setLastInsertedRoomBedId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  
  const roomIdRef = useRef(null);
  const roombedNameRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.roomBedId) {
      setCurrentRoomBedId(location.state.roomBedId);
      fetchRoomBedNumberData(location.state.roomBedId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchRoomBedNumberData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}RoomBedMst/RetriveRoomBedMst`, { 
        roomBedId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const RoomBedNumberData = response.data.data[0];
        setFormData({
          roomId: RoomBedNumberData.RoomId, 
          roombedName: RoomBedNumberData.RoombedName,
          remark: RoomBedNumberData.Remark
        });
        setIsFormDisabled(true);
        setCurrentRoomBedId(RoomBedNumberData.roomBedId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch roombed number data');
      }
    } catch (error) {
      console.error('Error fetching roombed number data:', error);
      toast.error('Error fetching roombed number data. Please try again.');
    }
  };


  useEffect(() => {
    const getRoom = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}RoomMst/getdrpRoomMst`).then((res) => {
        setRoomId(res.data.data)
        console.log("res", res);
      }).catch((err) => {
        console.log(err)
      })
    }
    getRoom()
  }, [])

  const handlePrevious = async () => {
    if (currentRoomBedId && currentRoomBedId > 1) {
      await fetchRoomBedNumberData(currentRoomBedId, "P");
    }
  };

  const handleNext = async () => {
    if (currentRoomBedId) {
      await fetchRoomBedNumberData(currentRoomBedId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'RoomBedNumber') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }

  if (name === 'RoomBedNumber' && value !== '') {
    setTimeout(() => {
      remarkRef.current.focus();
    }, 100000);
  }
};

const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    if (event.target === roombedNameRef.current) {
      remarkRef.current.focus();
    } else {
      roombedNameRef.current.focus();
    }
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.roomId) {
    toast.error('Room ID is required');
    setError(prev => ({ ...prev, roomId: true }));
    hasError = true;
  } else if (!/^[0-9]+$/.test(formData.roomId) && !/^[A-Za-z]+$/.test(formData.roomId)) {
    toast.error('Room ID must be numeric or alphabetic characters');
    setError(prev => ({ ...prev, roomId: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, roomId: false }));
  }

  if (!formData.roombedName) {
    toast.error('RoombedName is required');
    setError(prev => ({ ...prev, roombedName: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, roombedName: false }));
  }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      roomId: parseInt(formData.roomId),
      roombedName: formData.roombedName,
      remark: formData.remark,
      status: "1"
    };

    let response;
    if (mode === 'edit' && currentRoomBedId) {
      payload.roomBedId = currentRoomBedId;
      response = await axios.patch(`${process.env.REACT_APP_API_URL}RoomBedMst/UpdateRoomBedMst`, payload);
    } else {
      response = await axios.post(`${process.env.REACT_APP_API_URL}RoomBedMst/InsertRoomBedMst`, payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedRoomBedId(response.data.data)
        console.log(response.data.data)
        await fetchRoomBedNumberData(response.data.data);
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
          setCurrentRoomBedId(response.data.data);
      } else {
        setMode('view');
      }
      setIsFormDisabled(true);
    } else {
      toast.error(response.data.message || 'Operation failed');
    }
  } catch (error) {
    console.error('Error saving/updating roombed number:', error);
    toast.error('Error saving/updating roombed number. Please try again.');
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
      roomId: '',
      roombedName: '',
      remark: ''
    });
    setCurrentRoomBedId(null);

    // setTimeout(() => {
    //   roomNoRef.current.focus();
    // }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchRoomBedNumberData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      roomId: '',
      roombedName: '',
      remark: ''
    });
    setCurrentRoomBedId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/RoomBedNumbertable')
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
      await fetchRoomBedNumberData(currentRoomBedId, "D");
      // toast.success('Data deleted successfully');
      await fetchRoomBedNumberData(currentRoomBedId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting RoomBed Number:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };
  
  // const handleDelete = async () => {
  //   try{
  //      await fetchRoomBedNumberData(currentRoomBedId,"D")
  //      toast.success('Room Bed deleted successfully');
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
            disabled={mode !== 'view' || !currentRoomBedId || currentRoomBedId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentRoomBedId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>RoomBedNumber Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentRoomBedId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentRoomBedId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDeleteClick}
            disabled={mode !== 'view' || !currentRoomBedId || currentRoomBedId === 1}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentRoomBedId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6}>
              <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="roomId-select-label">Room No</InputLabel>
              <Select
                labelId="roomId-select-label"
                id="roomId-select"
                name="roomId"
                value={formData.roomId}
                onChange={handleInputChange}
                className="custom-textfield"
                // disabled={isFormDisabled}
              >
                {roomId.map((roomId) => (
                
                <MenuItem key={roomId.id} value={roomId.id}>{roomId.id}</MenuItem>
                ))}
              </Select>
              </FormControl>
                {/* <TextField
                  id="roomId"
                  name="roomId"
                  label={
                    <span>
                      RoomNo <span style={{ color: 'red' }}>*</span>
                    </span>
                   }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.roomId}
                  helperText={error.roomId && ""}
                  inputRef={roomIdRef}
                  onKeyDown={handleKeyPress}
                /> */}
              </Grid>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="roombedName"
               name="roombedName"
               label="Roombed No"
               variant="filled"
               fullWidth
               className="custom-textfield"
               value={formData.roombedName}
               onChange={handleInputChange}
               disabled={isFormDisabled}
               error={error.roombedName}
               helperText={error.roombedName && ""}
               inputRef={roombedNameRef}
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

export default RoomBedNumber