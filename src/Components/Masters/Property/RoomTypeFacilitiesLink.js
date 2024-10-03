import React, { useEffect, useState } from 'react'
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

const RoomTypeFacilitiesLink = () => {
  const [formData, setFormData] = useState({
    roomId: '',
    facilityId: ''
  });

  const [error, setError] = useState({
    roomId: false,
    facilityId: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [RoomTypeFacilityLinkId, setRoomTypeFacilityLinkId] = useState(null);
  const location = useLocation();
  const [currentRoomTypeFacilityLinkId, setCurrentRoomTypeFacilityLinkId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedRoomTypeFacilityLinkId, setLastInsertedRoomTypeFacilityLinkId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.RoomFacId) {
      setCurrentRoomTypeFacilityLinkId(location.state.RoomFacId);
      fetchRoomTypeFacilitiesLinkData(location.state.RoomFacId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);
 
  const fetchRoomTypeFacilitiesLinkData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}RoomFacLink/RetriveRoomFacLink`, { 
        RoomFacId: parseInt(id),
        Flag: flag 
      });
 
      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const RoomTypeFacilitiesLinkData = response.data.data[0];
        setFormData({
          roomId: RoomTypeFacilitiesLinkData.roomId, 
          facilityId: RoomTypeFacilitiesLinkData.facilityId
        });
        setIsFormDisabled(true);
        setCurrentRoomTypeFacilityLinkId(RoomTypeFacilitiesLinkData.RoomTypeFacilityLinkId); 
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch roomtype data');
      }
    } catch (error) {
      console.error('Error fetching room type data:', error);
      toast.error('Error fetching room type data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentRoomTypeFacilityLinkId && currentRoomTypeFacilityLinkId > 1) {
      await fetchRoomTypeFacilitiesLinkData(currentRoomTypeFacilityLinkId, "P");
    }
  };

  const handleNext = async () => {
    if (currentRoomTypeFacilityLinkId) {
      await fetchRoomTypeFacilitiesLinkData(currentRoomTypeFacilityLinkId, "N");
    }
  };

const handleInputChange = (event) => {
  const { name, value } = event.target;
  setFormData(prevState => ({
    ...prevState,
    [name]: value
  }));


  if (name === 'RoomTypeFacilitiesLink') {
    setFormData(prevState => ({
      ...prevState,
      state: ''
    }));
  }
};

const handleSave = async () => {

  let hasError = false;

  if (!formData.roomId) {
    toast.error('Room Type name is required');
    setError(prev => ({ ...prev, roomId: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, roomId: false }));
  }

  if (!formData.facilityId) {
    toast.error('Room Type id is required');
    setError(prev => ({ ...prev, facilityId: true }));
    hasError = true;
  } else if (!/^[0-9]+$/.test(formData.facilityId) && !/^[A-Za-z]+$/.test(formData.facilityId)) {
    toast.error('Room Type ID must be numeric or alphabetic characters');
    setError(prev => ({ ...prev, facilityId: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, facilityId: false }));
  }

  if (hasError) {
    return;
  }


  try {
    const payload = {
      roomId: formData.roomId,
      facilityId: formData.facilityId,
      status: "1"
    };

    let response;
    if (mode === 'edit') {
      payload.RoomFacId = currentRoomTypeFacilityLinkId;
      response = await axios.patch('', payload);
    } else {
      response = await axios.post('', payload);
    }

    if (response.data.status === 0 && response.data.responseStatusCode === 1) {
      toast.success(response.data.message);
      if (mode === 'add') {
        setLastInsertedRoomTypeFacilityLinkId(response.data.data)
        console.log(response.data.data)
        await fetchRoomTypeFacilitiesLinkData(response.data.data);
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
          setCurrentRoomTypeFacilityLinkId(response.data.data);
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
      roomId: '',
      facilityId: ''
    });
    setCurrentRoomTypeFacilityLinkId(null);
  };

  const handleCancel = async () => {
    try {
      await fetchRoomTypeFacilitiesLinkData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      roomId: '',
      facilityId: ''
    });
    setCurrentRoomTypeFacilityLinkId(null);
    setMode('view');
  };

  const handleExit=()=>{
    navigate('/RoomTypeFacilitiesLinktable')
  }
  
  const handleDelete = async () => {
    try{
       await fetchRoomTypeFacilitiesLinkData(currentRoomTypeFacilityLinkId,"D")
       toast.success('Room Type deleted successfully');
       resetForm();
       setMode('add');
    }catch(error){
      toast.error('Error occurred while deleting. Please try again.');
    }
    };

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
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId || currentRoomTypeFacilityLinkId === 1}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            sx={{ margin:'0px 10px' }}  
            className='three-d-button-next'    
            onClick={handleNext}
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId}
          >
             <NavigateNextIcon />
          </Button>
          </Grid>
          <h3 style={{ }}>RoomTypeFacilitiesLink Master</h3>
          <Grid sx={{display:'flex', justifyContent:'end'}}>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed'}}     
            onClick={handleAdd}
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId}
          >
             <AddIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' ,margin:'0px 10px'}}     
            onClick={handleEdit}
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId}
          >
             <EditIcon />
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed' }} 
            onClick={handleDelete}
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId || currentRoomTypeFacilityLinkId === 1}
          >
            <DeleteIcon />
          </Button>
          {/* <h3 style={{ margin: 0 }}>Country Master</h3> */}
        
  
          <Button 
            variant="contained" 
            size="small" 
            sx={{ backgroundColor: '#7c3aed',margin:'0px 10px'}}     
            onClick={handleExit}
            disabled={mode !== 'view' || !currentRoomTypeFacilityLinkId}
          >
             <CancelPresentationIcon />
          </Button>
          </Grid>
        </Grid>
     
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
             <Grid item xs={12} md={6} lg={6}>
              <TextField
               id="roomId"
               name="roomId"
               label={
                <span>
                  Room Id <span style={{ color: 'red' }}>*</span>
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
    </>
  )
}

export default RoomTypeFacilitiesLink