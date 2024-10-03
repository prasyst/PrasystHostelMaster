import React, { useState } from 'react';
import { Container, Box, Grid, TextField, Button, Typography, Link } from '@mui/material';
// import logo from '../Components/Images/logo.webp';
import hostel2 from '../assets/Images/hostel2.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        try {
            // Replace with your actual API endpoint
            const response = await axios.post('http://your-api-endpoint/change-password', {
                oldPassword,
                newPassword
            });

            if (response.data.status === 0) {
                toast.success('Password changed successfully', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                toast.error('Password change failed: ' + response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error('An error occurred while changing password.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    return (
        <Box className="">
            <ToastContainer />
            <Container container className='main_container_changepassword'>
                <Grid container spacing={2} alignItems="center" justifyContent="center" className='middle'>
                    <Grid item xs={12} md={6} className='chnage_pass'>
                        <Box display="flex" flexDirection="column" justifyContent="center">
                            {/* <img src={logo} alt='logo' style={{ width: '200px' }} /> */}
                            <Typography variant="h5" gutterBottom className='mb-4'>
                                Change Your Password
                            </Typography>
                            <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginBottom: '5px' }}>
                                Old Password
                            </Typography>
                            <TextField
                                type='password'
                                variant="outlined"
                                placeholder="Enter your old password"
                                fullWidth
                                className='input_form'
                                value={oldPassword}
                                sx={{
                                    '& .MuiOutlinedInput-input': {
                                        paddingTop: '8px',
                                        paddingBottom: '8px',
                                    }
                                }}
                                onChange={(e) => setOldPassword(e.target.value)}
                                InputProps={{
                                    classes: {
                                        input: 'custom-placeholder',
                                    },
                                }}
                            />
                            <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginTop: '12px', marginBottom: '5px' }}>
                                New Password
                            </Typography>
                            <TextField
                                type='password'
                                variant="outlined"
                                placeholder="Enter your new password"
                                fullWidth
                                className='input_form'
                                value={newPassword}
                                sx={{
                                    '& .MuiOutlinedInput-input': {
                                        paddingTop: '8px',
                                        paddingBottom: '8px',
                                    }
                                }}
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    classes: {
                                        input: 'custom-placeholder',
                                    },
                                }}
                            />
                            <Typography variant="subtitle1" style={{ fontWeight: 550, color: '#29343d', fontSize: '15px', marginTop: '12px', marginBottom: '5px' }}>
                                Confirm New Password
                            </Typography>
                            <TextField
                                type='password'
                                variant="outlined"
                                placeholder="Confirm your new password"
                                fullWidth
                                className='input_form'
                                value={confirmPassword}
                                sx={{
                                    '& .MuiOutlinedInput-input': {
                                        paddingTop: '8px',
                                        paddingBottom: '8px',
                                    }
                                }}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    classes: {
                                        input: 'custom-placeholder',
                                    },
                                }}
                            />
                            <Button onClick={handleChangePassword} className='button_signin' variant="contained" fullWidth style={{ marginTop: 16 }}>
                                Change Password
                            </Button>
                            <Typography variant="body2" style={{ marginTop: 16 }}>
                                Return to <Link href="/dashboard">Dashboard</Link>
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} style={{ textAlign: 'center' }}
                        sx={{
                            display: { xs: 'none', md: 'block' },
                        }}
                    >
                        <Box
                            component="img"
                            src={hostel2}
                            alt="Feature Rich 3D Charts"
                            style={{ width: '200px', marginTop: '' }}
                        />
                        <Typography variant="h6" gutterBottom>
                            Feature Rich 3D Charts
                        </Typography>
                        <Button variant="outlined" style={{ marginTop: 6, backgroundColor: '#635BFF', color: 'white', textTransform: 'capitalize' }}>
                            Learn More
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default ChangePassword;