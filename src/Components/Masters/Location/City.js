import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { useRef } from 'react';
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
import { CountryAutocomplete, StateAutocomplete, ZoneAutocomplete } from '../../../Components/AutoComplete/AutoComplete'
import AuthHeader from '../../../Auth';


const City = () => {
  const [formData, setFormData] = useState({
    Country: '',
    State: '',
    Zone: '',
    City: '',
    ShortName: '',
    CityCode: ''
  });

  const [error, setError] = useState({
    country: false,
    state: false,
    zone: false,
    city: false,
    cityCode: false
  });

  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([])
  const [zone, setZone] = useState([])
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [countryIds, setCountryIds] = useState([]);
  const [cityId, setCityId] = useState(null);
  const location = useLocation();
  const [isNewCity, setIsNewCity] = useState(true);
  const [currentCityId, setCurrentCityId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedCityId, setLastInsertedCityId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const countryRef = useRef(null);
  const stateRef = useRef(null);
  const zoneRef = useRef(null);
  const cityRef = useRef(null);
  const shortNameRef = useRef(null);
  const cityCodeRef = useRef(null);
  

  useEffect(() => {
    if (location.state && location.state.CityId) {
      setCurrentCityId(location.state.CityId);
      fetchCityData(location.state.CityId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  useEffect(() => {
    const getStatesUpdate = async () => {
      if (formData.Country) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}stateMst/getCountrywiseStatedrp`, AuthHeader ,
            { CountryId: parseInt(formData.Country) }
          );
          setStates(response.data.Data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getStatesUpdate();
  }, [formData.Country]);

  const fetchCityData = async (id, flag) => {

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}CityMst/RetrivecityMst`, {
        CityId: parseInt(id),
        Flag: flag
      }, AuthHeader);

      if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
        const cityData = response.data.Data[0];
        console.log('city',response.data.Data)
        setFormData({
          Country: cityData.countryId ? cityData.countryId.toString() : "",
          // country: cityData.countryId.toString(),
          State: cityData.StateId,
          Zone: cityData.ZoneId,
          City: cityData.CityName,
          ShortName: cityData.CityAbrv,
          CityCode: cityData.CityCode
        });
        setIsFormDisabled(true);
        setCurrentCityId(cityData.CityId);
      } else if (response.data.Status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch city data');
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
      toast.error('Error fetching city data. Please try again.');
    }
  };

  const handlePrevious = async () => {
    if (currentCityId && currentCityId > 1) {
      await fetchCityData(currentCityId, "P");
    }
  };

  const handleNext = async () => {
    if (currentCityId) {
      await fetchCityData(currentCityId, "N");
    }
  };
  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}StateMst/getcountydrp`, AuthHeader);
        setCountries(response.data.Data);
        const idMapping = response.data.Data.reduce((acc, country) => {
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


  useEffect(() => {
    const getStates = async () => {
      if (formData.Country) {
        try {
          const countryId = countryIds[formData.Country];
          if (countryId) {
            const response = await axios.post(
              `${process.env.REACT_APP_API_URL}stateMst/getCountrywiseStatedrp`, AuthHeader,
              { CountryId: countryId }
            );
            setStates(response.data.Data);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    getStates();
  }, [formData.Country, countryIds]);

  useEffect(() => {
    const getZone = async () => {
      await axios.get(`${process.env.REACT_APP_API_URL}CityMst/getzonedrp`, AuthHeader).then((res) => {
        setZone(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    getZone()
  }, [])


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
        cityCodeRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === countryRef.current) {
        stateRef.current.focus();
      } else if (event.target === stateRef.current) {
        cityRef.current.focus();
      } else if(event.target === cityRef.current){
        zoneRef.current.focus();
      } else if(event.target === zoneRef.current){
        shortNameRef.current.focus();
      } else {
        cityCodeRef.current.focus();
      }
    }
  };

  const handleSave = async () => {

    let hasError = false;

  if (!formData.Country) {
    toast.error('Country name is required');
    setError(prev => ({ ...prev, Country: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, Country: false }));
  }

  if (!formData.State) {
    toast.error('State name is required');
    setError(prev => ({ ...prev, State: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, State: false }));
  }

  if (!formData.Zone) {
    toast.error('Zone name is required');
    setError(prev => ({ ...prev, Zone: true }));
    hasError = true;
  } else {
    setError(prev => ({ ...prev, Zone: false }));
  }

  // if (!formData.city) {
  //   toast.error('City name is required');
  //   setError(prev => ({ ...prev, city: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, city: false }));
  // }

  // if (!formData.cityCode) {
  //   toast.error('City code is required');
  //   setError(prev => ({ ...prev, cityCode: true }));
  //   hasError = true;
  // } else if (!/^[0-9]+$/.test(formData.cityCode) && !/^[A-Za-z]+$/.test(formData.cityCode) && !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(formData.cityCode)) {
  //   toast.error('City code must be two numeric or alphabetic characters');
  //   setError(prev => ({ ...prev, cityCode: true }));
  //   hasError = true;
  // } else {
  //   setError(prev => ({ ...prev, cityCode: false }));
  // }

  if (hasError) {
    return;
  }


    try {
      const payload = {
        CityName: formData.City,
        CityAbrv: formData.ShortName,
        StateId: parseInt(formData.State),
        ZoneId: parseInt(formData.Zone),
        CityCode: formData.CityCode,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.CityId = currentCityId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}cityMst/UpdatecityMst`, payload, AuthHeader);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}cityMst/InsertcityMst`, payload, AuthHeader);
      }

      if (response.data.Status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedCityId(response.data.Data)
          console.log(response.data.Data)
          await fetchCityData(response.data.Data);
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
          setCurrentCityId(response.data.Data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating city:', error);
      toast.error('Error saving/updating city. Please try again.');
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
      Country: '',
      State: '',
      Zone: '',
      City: '',
      ShortName: '',
      CityCode: ''
    });
    setCurrentCityId(null);

    setTimeout(() => {
      countryRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    if (mode === 'add') {
      try {
        await fetchCityData(1, "L");
        setMode('view');
        setIsFormDisabled(true);
      } catch (error) {
        toast.error('Error occurred while cancelling. Please try again.');
      }
    } else if (mode === 'edit') {
      if (currentCityId) {
        await fetchCityData(currentCityId);
      }
      setMode('view');
      setIsFormDisabled(true);
    }

  };

  const resetForm = () => {
    setFormData({
      Country: '',
      State: '',
      Zone: '',
      City: '',
      ShortName: '',
      CityCode: ''
    });
    setCurrentCityId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/citytable')
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
      await fetchCityData(currentCityId, "D");
      await fetchCityData(currentCityId, "N");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      console.error('Error deleting city:', error);
      toast.error('Error occurred while deleting. Please try again.');
    }
  };

  return (
    <>

      <Box className="form-container">

        <ToastContainer />
        <Grid container spacing={2} className='form_grid'>
        <h3 style={{marginLeft:'15px'}}>City Master</h3>
          <Grid item xs={12} className='form_title' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                className='three-d-button-previous'
                onClick={handlePrevious}
                disabled={mode !== 'view' || !currentCityId || currentCityId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                className='three-d-button-next'
                size="small"
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleNext}
                disabled={mode !== 'view' || !currentCityId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentCityId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentCityId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentCityId}
              >
                <DeleteIcon />
              </Button>
             


              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#635BFF', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentCityId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>


          <Grid item xs={12} md={6} lg={6} className='form_field' >
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
              >
                {countries.map((country) => (
                
                  <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <CountryAutocomplete
              countries={countries}
              value={formData.Country}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.country}
              helperText={error.country ? '' : ''}
              ref={countryRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
   
            <StateAutocomplete
              states={states}
              value={states.find(state => state.id === formData.State) || null}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.state}
              helperText={error.state ? '' : ''}
              ref={stateRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            <TextField
              id="City"
              name="City"
              label="City"
              variant="filled"
              fullWidth
              className="custom-textfield"
              value={formData.City}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.city}
              helperText={error.city ? '' : ''}
              inputRef={cityRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='form_field'>
            {/* <FormControl variant="filled" fullWidth className="custom-select">
              <InputLabel id="zone-select-label">Select Zone</InputLabel>
              <Select
                labelId="zone-select-label"
                id="zone-select"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                className="custom-textfield"
                disabled={isFormDisabled}
              >
                {zone.map((zone) => (
                  <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <ZoneAutocomplete
              zones={zone}
              value={zone.find(z => z.id === formData.Zone) || null}
              onChange={handleInputChange}
              disabled={isFormDisabled}
              error={error.zone}
              helperText={error.zone ? '' : ''}
              ref={zoneRef}
              onKeyDown={handleKeyPress}
            />
          </Grid>
          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
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
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="CityCode"
                  name="CityCode"
                  label="City Code"
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.CityCode}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.cityCode}
                  helperText={error.cityCode ? '' : ''}
                  inputRef={cityCodeRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #d4d4d4)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #b9d0e9, #e9f2fa)' }} onClick={handleEdit}
                  // disabled={!currentCityId}
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
                <Button variant="contained"
                  onClick={handleCancel}>
                  Cancel
                </Button>

              </>
            )}
          </Grid>
        </Grid>
      </Box>
      {/* dailog box */}
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
            Are you sure you want to delete this data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button sx={{
            backgroundColor: '#635BFF',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
              color: 'white'
            }
          }} onClick={handleConfirmDelete} >
            Yes
          </Button>
          <Button sx={{
            backgroundColor: '#635BFF',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
              color: 'white'
            }

          }} onClick={handleCloseConfirmDialog}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default City