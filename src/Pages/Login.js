import React, { useState } from 'react';
import { Container, Box, Grid, TextField, Button, Typography, Checkbox, Link } from '@mui/material';
import hostel2 from '../assets/Images/hostel2.jpg';
import logo from '../assets/Images/logo111.PNG'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [number, setNumber] = useState('');
    const [loginMethod, setLoginMethod] = useState('userId');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };



    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}Login/UserMst/GetuserLogin`, {
                username: userId,
                pwd: password
            });

            if (response.data.status === 0) { // Check for status 0 as success
                const userName = response.data.userName || userId
                localStorage.setItem('userName', userName);
                localStorage.setItem('isLoggedIn', 'true');
                toast.success('Login Successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000); // Delay of 2 seconds before redirecting
            } else {
                toast.error('Login failed: ' + response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    const handlePasswordChange = () => {
    }
    return (
        <Box className='main_login'>
            <ToastContainer />
            <Container container className='main_container'>

                <Grid container spacing={2} alignItems="center" justifyContent="center" className='middle_container'>
                    <Grid item xs={12} md={6}>
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            <img src={logo} alt='logo' style={{ width: '200px' }} />
                            <Typography variant="h4" gutterBottom className='mb-4'>
                                Let's get you signed in
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <Button
                                        startIcon={<AssignmentIndIcon />}
                                        className={`buttons ${loginMethod === 'userId' ? 'active' : ''}`}
                                        fullWidth
                                        style={{ marginBottom: 16 }}
                                        onClick={() => setLoginMethod('userId')}
                                    >
                                        Login with UserId
                                    </Button>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <Button
                                        startIcon={<PhoneAndroidIcon />}
                                        className={`buttons ${loginMethod === 'mobile' ? 'active' : ''}`}
                                        fullWidth
                                        style={{ marginBottom: 16 }}
                                        onClick={() => setLoginMethod('mobile')}
                                    >
                                        Login With OTP
                                    </Button>
                                </Grid>
                            </Grid>
                            {loginMethod === 'userId' ? (     <>
                                    <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginBottom: '5px' }}>
                                        User Id
                                    </Typography>
                                    <TextField
                                        type='text'
                                        variant="outlined"
                                        placeholder="Enter your Id"
                                        fullWidth
                                        className='input_form'
                                        value={userId}
                                        sx={{
                                            '& .MuiOutlinedInput-input': {
                                                paddingTop: '8px',
                                                paddingBottom: '8px',
                                            }
                                        }}
                                        onChange={(e) => setUserId(e.target.value)}
                                        InputProps={{
                                            classes: {
                                                input: 'custom-placeholder',
                                            },
                                        }}
                                    />

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginTop: '12px', paddingBottom: '5px' }}>
                                            Password
                                        </Typography>
                                        <Link onClick={toggleForgotPassword} variant="body2" className='forgot_pass' style={{ cursor: 'pointer' }}>
                                            Forgot Password?
                                        </Link>
                                    </Box>
                                    <TextField
                                        type='password'
                                        variant="outlined"
                                        placeholder="Enter Your password"
                                        fullWidth
                                        className='input_form '
                                        sx={{
                                            '& .MuiOutlinedInput-input': {
                                                paddingTop: '8px',
                                                paddingBottom: '8px',
                                            }
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        InputProps={{
                                            classes: {
                                                input: 'custom-placeholder',
                                            },
                                        }}
                                    />
                                </>):(  <>
                                    <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginBottom: '5px' }}>
                                        Mobile Number
                                    </Typography>
                                    <TextField
                                        type='text'
                                        variant="outlined"
                                        placeholder="Enter your Number"
                                        fullWidth
                                        className='input_form'
                                        value={number}
                                        sx={{
                                            '& .MuiOutlinedInput-input': {
                                                paddingTop: '8px',
                                                paddingBottom: '8px',
                                            }
                                        }}
                                        onChange={(e) => setNumber(e.target.value)}
                                        InputProps={{
                                            classes: {
                                                input: 'custom-placeholder',
                                            },
                                        }}
                                    />
                                </>)}


                            <Box className="py-2" display="flex" justifyContent="space-between" alignItems="center" >
                                <Box display="flex" alignItems="center" >
                                    <Checkbox className="check_box" />
                                    <Typography variant="body2" className='mx-2'>Keep me logged in</Typography>
                                </Box>

                            </Box>
                            <Button onClick={handleLogin} className='button_signin' variant="contained" fullWidth style={{ marginTop: 16 }}>
                          Sign In
                      </Button>
                            <Typography variant="body2" style={{ marginTop: 16 }}>
                                Don't have an account yet? <Link href="#">Sign Up Now</Link>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={{ textAlign: 'center' }}
                        sx={{
                            display: { xs: 'none', md: 'block' }, // Hides on xs screens, shows on md and up
                        }}
                    >
                        <Box
                            component="img"
                            src={hostel2}
                            alt="Feature Rich 3D Charts"
                            style={{ width: '200px', marginTop: '50px' }}

                        />
                        <Typography variant="h6" gutterBottom>
                            Feature Rich 3D Charts
                        </Typography>
                        {/* <Typography variant="body2" color="textSecondary">
                            Donec justo tortor, malesuada vitae faucibus ac, tristique sit amet massa. Aliquam dignissim nec felis quis imperdiet.
                        </Typography> */}
                        <Button variant="outlined" style={{ marginTop: 6, backgroundColor: '#635BFF', color: 'white', textTransform: 'capitalize' }}>
                            Learn More
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Login;
