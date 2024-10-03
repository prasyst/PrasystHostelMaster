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
import { CourseAutocomplete } from '../../../Components/AutoComplete/AutoComplete'

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

const SemesterMaster = () => {
  const [formData, setFormData] = useState({
    semesterName: '',
    courseName: '',
    remark: ''
  });

  const [error, setError] = useState({
    semesterName: false,
    courseName: false
  });

  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [semesterId, setSemesterId] = useState(null);
  const location = useLocation();
  const [currentSemesterId, setCurrentSemesterId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isViewMode, setIsViewMode] = useState(false);
  const [mode, setMode] = useState('view');
  const [lastInsertedSemesterId, setLastInsertedSemesterId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const courseNameRef = useRef(null);
  const semesterNameRef = useRef(null);
  const remarkRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.semesterId) {
      setCurrentSemesterId(location.state.semesterId);
      fetchSemesterData(location.state.semesterId);
      setMode('view');
    } else {
      setMode('add');
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchSemesterData = async (id, flag) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}MstSemester/RetriveMstSemester`, {
        semesterId: parseInt(id),
        Flag: flag
      });

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        const semesterData = response.data.data[0];
        setFormData({
          semesterName: semesterData.semesterName,
          courseName: semesterData.courseId.toString(),
          remark: semesterData.remark
        });
        setIsFormDisabled(true);
        setCurrentSemesterId(semesterData.semesterId);
      } else if (response.data.status === 1 && response.data.responseStatusCode === 2) {
        toast.info(response.data.message);
      } else {
        toast.error('Failed to fetch semester master data');
      }
    } catch (error) {
      console.error('Error fetching semester master data:', error);
      toast.error('Error fetching semester master data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}MstCourse/getMstCoursedrp`);
        if (response.data.status === 0 && response.data.responseStatusCode === 1) {
          setCourses(response.data.data);
        } else {
          toast.error('Failed to fetch Courses');
        }
      } catch (error) {
        console.error('Error fetching Courses:', error);
        toast.error('Error fetching Courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  const handlePrevious = async () => {
    if (currentSemesterId && currentSemesterId > 1) {
      await fetchSemesterData(currentSemesterId, "P");
    }
  };

  const handleNext = async () => {
    if (currentSemesterId) {
      await fetchSemesterData(currentSemesterId, "N");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'semester') {
      setFormData(prevState => ({
        ...prevState,
        state: ''
      }));
    }

    if (name === 'semester' && value !== '') {
      setTimeout(() => {
        remarkRef.current.focus();
      }, 100000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (event.target === courseNameRef.current) {
        semesterNameRef.current.focus();
      } else {
        remarkRef.current.focus();
      }
    }
  }

  const handleSave = async () => {

    let hasError = false;

    if (!formData.courseName) {
      toast.error('Course Name is required');
      setError(prev => ({ ...prev, courseName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, courseName: false }));
    }

    if (!formData.semesterName) {
      toast.error('Semester Name is required');
      setError(prev => ({ ...prev, semesterName: true }));
      hasError = true;
    } else {
      setError(prev => ({ ...prev, semesterName: false }));
    }

    if (hasError) {
      return;
    }


    try {
      const payload = {
        semesterName: formData.semesterName,
        courseId: parseInt(formData.courseName),
        remark: formData.remark,
        status: "1"
      };

      let response;
      if (mode === 'edit') {
        payload.semesterId = currentSemesterId;
        response = await axios.patch(`${process.env.REACT_APP_API_URL}MstSemester/UpdateMstSemester`, payload);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}MstSemester/InsertMstSemester`, payload);
      }

      if (response.data.status === 0 && response.data.responseStatusCode === 1) {
        toast.success(response.data.message);
        if (mode === 'add') {
          setLastInsertedSemesterId(response.data.data)
          console.log(response.data.data)
          await fetchSemesterData(response.data.data);
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
          setCurrentSemesterId(response.data.data);
        } else {
          setMode('view');
        }
        setIsFormDisabled(true);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving/updating Semester Master:', error);
      toast.error('Error saving/updating Semester Master. Please try again.');
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
      semesterName: '',
      courseName: '',
      remark: ''
    });
    setCurrentSemesterId(null);

    setTimeout(() => {
      courseNameRef.current.focus();
    }, 0);
  };

  const handleCancel = async () => {
    try {
      await fetchSemesterData(1, "L");
      setMode('view');
      setIsFormDisabled(true);
    } catch (error) {
      toast.error('Error occurred while cancelling. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      semesterName: '',
      courseName: '',
      remark: ''
    });
    setCurrentSemesterId(null);
    setMode('view');
  };

  const handleExit = () => {
    navigate('/semestertable')
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
      await fetchSemesterData(currentSemesterId, "D");
      await fetchSemesterData(currentSemesterId, "N");
      setMode('view');
      setIsFormDisabled(true);
      // resetForm();
      // setMode('add');
    } catch (error) {
      console.error('Error deleting Semester Master:', error);
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
                disabled={mode !== 'view' || !currentSemesterId || currentSemesterId === 1}
              >
                <KeyboardArrowLeftIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ margin: '0px 10px' }}
                className='three-d-button-next'
                onClick={handleNext}
                disabled={mode !== 'view' || !currentSemesterId}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>
            <h3>Semester Master</h3>
            <Grid sx={{ display: 'flex', justifyContent: 'end' }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleAdd}
                disabled={mode !== 'view' || !currentSemesterId}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleEdit}
                disabled={mode !== 'view' || !currentSemesterId}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed' }}
                onClick={handleDeleteClick}
                disabled={mode !== 'view' || !currentSemesterId || currentSemesterId === 1}
              >
                <DeleteIcon />
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: '#7c3aed', margin: '0px 10px' }}
                onClick={handleExit}
                disabled={mode !== 'view' || !currentSemesterId}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12} className='form_field'>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6} className='form_field'>
                <CourseAutocomplete
                  courses={courses}
                  value={courses.find(courseName => courseName.id == formData.courseName) || null}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.courseName}
                  helperText={error.courseName ? '' : ''}
                  ref={courseNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <TextField
                  id="semesterName"
                  name="semesterName"
                  label={
                    <span>
                      Semester <span style={{ color: 'red' }}>*</span>
                    </span>
                  }
                  variant="filled"
                  fullWidth
                  className="custom-textfield"
                  value={formData.semesterName}
                  onChange={handleInputChange}
                  disabled={isFormDisabled}
                  error={error.semesterName}
                  helperText={error.semesterName && ""}
                  inputRef={semesterNameRef}
                  onKeyDown={handleKeyPress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  variant="filled"
                  disabled={isFormDisabled}
                  className="custom-textfield"
                  inputRef={remarkRef}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} className="form_button">
            {mode === 'view' && (
              <>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #d4d4d4, #ffffff)' }} onClick={handleAdd} disabled>
                  Submit
                </Button>
                <Button variant="contained" sx={{ mr: 1, background: 'linear-gradient(290deg, #a7c5e9, #ffffff)' }} onClick={handleEdit}
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
                <Button variant="contained" sx={{ mr: 1 }} onClick={handleCancel}
                >
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

export default SemesterMaster