import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
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
import { FloorAutocomplete } from '../../../Components/AutoComplete/AutoComplete'

const AmenityMaster = () => {

  const [formData, setFormData] = useState({
    amenityName: '',
    amenity_Desc: '',
    floorName: '',
    areaSqFt: '',
    remark: '',
    photo: ''
  });

  const [error, setError] = useState({
    amenityName: false,
    amenity_Desc: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [amenityId, setamenityId] = useState(null);
  const location = useLocation();
  const [currentAmenityId, setCurrentAmenityId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [wings, setWings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [photo, setPhoto] = useState('');
  const [file, setFile] = useState(null);
  const [lastInsertedAmenityId, setLastInsertedAmenityId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const amenityNameRef = useRef(null);
  const amenity_DescRef = useRef(null);
  const areaSqFtRef = useRef(null);
  const floorRef = useRef(null);
  const remarkRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result); 
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

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
    if (location.state && location.state.amenityId) {
      setCurrentAmenityId(location.state.amenityId);
      fetchAmenityMasterData(location.state.amenityId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchAmenityMasterData = async (id, flag) => {

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}AmenityMst/RetriveAmenityMst`, {
        amenityId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const amenityData = response.data.data[0];
        setFormData({
          amenityName: amenityData.amenityName,
          amenity_Desc: amenityData.amenity_Desc,
          remark: amenityData.remark,
          floorName: amenityData.floorId.toString(),
          areaSqFt: amenityData.areaSqFt,
          photo: amenityData.photo
        });
        setIsFormDisabled(true);
        setCurrentAmenityId(amenityData.amenityId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch AmenityMaster data');
      }
    } catch (error) {
      console.error('Error fetching AmenityMaster data:', error);
      toast.error('Error fetching AmenityMaster data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchFloors = async (flag) => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}FloorMst/getFloorMstdrp`, {
          Flag: flag
        });
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setFloors(response.data.data);
        } else {
          toast.error('Failed to fetch Floors');
        }
      } catch (error) {
        console.error('Error fetching Floors:', error);
        toast.error('Error fetching Floors. Please try again.');
      }
    };

    fetchFloors();
  }, []);

  const handlePrevious = async () => {
    if (currentAmenityId && currentAmenityId > 1) {
      await fetchAmenityMasterData(currentAmenityId, "P");
    }
  };

  const handleNext = async () => {
    if (currentAmenityId) {
      await fetchAmenityMasterData(currentAmenityId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));


    if (name === 'amenityMaster') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'amenityMaster' && value !== '') {
      setTimeout(() => {
        remarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === amenityNameRef.current) {
        amenity_DescRef.current.focus();
      } else if (event.target === amenity_DescRef.current){
        floorRef.current.focus();
      }else if (event.target === floorRef.current){
        areaSqFtRef.current.focus();
      }else {
        remarkRef.current.focus();
      }
    }
  };


  const handleSave = async () => {

    let hasError = false;

    if (!formData.amenityName) {
      toast.error('Amenity Name is required');
      setError(prev => ({ ...prev, amenityName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, amenityName: false }));
    }

    if (!formData.floorName) {
      toast.error('Floor is required');
      setError(prev => ({ ...prev, floorName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, floorName: false }));
    }

    if (hasError) {
      return;
    }

    try {
      const payload = {
        amenityName: formData.amenityName,
        amenity_Desc: formData.amenity_Desc,
        floorId: parseInt(formData.floorName),
        areaSqFt: formData.areaSqFt,
        remark: formData.remark,
        photo: formData.photo,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.amenityId = currentAmenityId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}AmenityMst/UpdateAmenityMst`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}AmenityMst/InsertAmenityMst`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedAmenityId(response.data.data)
          console.log(response.data.data)
          await fetchAmenityMasterData(response.data.data);

          setMode('view');
          setIsFormDisabled(true);
          setCurrentAmenityId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating AmenityMaster:', error);
      toast.error('Error saving/updating AmenityMaster. Please try again.');
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
      amenityName: '',
      amenity_Desc: '',
      remark: '',
      areaSqFt: '',
      floorName: '',
      photo: ''
    });
    setCurrentAmenityId(null);

    setTimeout(() => {
      amenityNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchAmenityMasterData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      amenityName: '',
      amenity_Desc: '',
      remark: '',
      areaSqFt: '',
      floorName: '',
      photo: ''
    });
    setCurrentAmenityId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/amenitytable')
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
      await fetchAmenityMasterData(currentAmenityId, "D");
      await fetchAmenityMasterData(currentAmenityId, "N");
      setMode('view');
      setIsFormDisabled(true);
      
    } catch (error) {
      console.error('Error deleting Amenity Master:', error);
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
                disabled={mode !== 'view' || !currentAmenityId || currentAmenityId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentAmenityId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3 style={{}}>Amenity Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentAmenityId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentAmenityId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentAmenityId || currentAmenityId === 0}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentAmenityId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

         
          <Grid item lg={8} md={8} xs={12}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Grid item lg={12} md={12} xs={12}>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                      <TextField
                        id="amenityName"
                        name="amenityName"
                        label={
                          <span>
                            Amenity Name <span style={{ color: 'red' }}>*</span>
                          </span>
                        }
                        variant="filled"
                        fullWidth
                        className="custom-textfield"
                        value={formData.amenityName}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        error={error.amenityName}
                        helperText={error.amenityName && ""}
                        inputRef={amenityNameRef}
                        onKeyDown={handleKeyPress}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <TextField
                        id="amenity_Desc"
                        name="amenity_Desc"
                        label="Description"
                        variant="filled"
                        fullWidth
                        className="custom-textfield"
                        value={formData.amenity_Desc}
                        onChange={handleInputChange}
                        disabled={isFormDisabled}
                        error={error.amenity_Desc}
                        helperText={error.amenity_Desc && ""}
                        inputRef={amenity_DescRef}
                        onKeyDown={handleKeyPress}
                      />
                    </Grid>
                  </Grid>
                </Box>

              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6} className='form_field'>
                  <FloorAutocomplete
                    floors={floors}
                    value={floors.find(floorName => floorName.id == formData.floorName) || null}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    error={error.floorName}
                    helperText={error.floorName ? '' : ''}
                    ref={floorRef}
                    onKeyDown={handleKeyPress}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="areaSqFt"
                    name="areaSqFt"
                    label="AreaSqFt"
                    variant="filled"
                    fullWidth
                    className="custom-textfield"
                    value={formData.areaSqFt}
                    onChange={handleInputChange}
                    disabled={isFormDisabled}
                    error={error.areaSqFt}
                    helperText={error.areaSqFt && ""}
                    inputRef={areaSqFtRef}
                    onKeyDown={handleKeyPress}
                  />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
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

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit}
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

export default AmenityMaster