import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MdDashboard } from "react-icons/md";
import MailIcon from '@mui/icons-material/Mail';
import logo from '../assets/Images/Clanbridge-logo.png.png';
import { VscThreeBars } from "react-icons/vsc";
import { MdOutlineReport } from "react-icons/md";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PeopleIcon from '@mui/icons-material/People';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BuildIcon from '@mui/icons-material/Build';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import TaskIcon from '@mui/icons-material/Task';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import ErrorOutlineSharpIcon from '@mui/icons-material/ErrorOutlineSharp';
import ManSharpIcon from '@mui/icons-material/ManSharp';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import LocalActivityTwoToneIcon from '@mui/icons-material/LocalActivityTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import Entity from '../Components/Entity';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function SidebarDrawar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');
  const [mastersOpen, setMastersOpen] = useState(false);
  const [operationsOpen, setOperationsOpen] = useState(false);
  const [enquiryOpen,setEnquiryOpen]=useState(false)
  const [billingsOpen,setBillingsOpen]=useState(false)
  const [inventoryOpen,setInventoryOpen]=useState(false)
  const [accountOpen,setAccountOpen]=useState(false)
  const [reportsOpen,setReportsOpen]=useState(false)
  const [utilitiesOpen,setUtilitiesOpen]=useState(false)

  const mastersSubItems = [
    { name: 'Company', path: '/masters/company', icon: <CorporateFareIcon sx={{color:'#1976d2'}}/> },
    { name: 'Property', path: '/masters/property', icon: <ApartmentIcon sx={{color:'#1976d2'}}/> },
    { name: 'AR/AP', path: '/masters/people', icon: <PeopleIcon sx={{color:'#1976d2'}}/> },
    { name: 'Location', path: '/masters/location', icon: <LocationOnIcon sx={{color:'#1976d2'}}/> },
    { name: 'Accounts', path: '/masters/accounts', icon: <AccountBoxIcon sx={{color:'#1976d2'}}/> },
    { name: 'Ticketing', path: '/masters/ticketing', icon: <EventSeatIcon sx={{color:'#1976d2'}}/> },
    { name: 'Operations', path: '/masters/operations', icon: <TaskIcon sx={{color:'#1976d2'}}/> },
    { name: 'Inventory', path: '/masters/inventory', icon: <InventoryRoundedIcon sx={{color:'#1976d2'}}/> },
    {name :'Other Master',path:'/masters/other-master', icon:<MoreHorizIcon sx={{color:'#1976d2'}}/>},
    { name: 'Control & Security', path: '/masters/control-security', icon: <SecurityRoundedIcon sx={{color:'#1976d2'}} /> }
  ];
  const operationsSubItems = [
    { name: 'House Keeping', path: '/operations/housekeepin', icon: <HomeRepairServiceIcon sx={{color:'#1976d2'}}/> },
    { name: 'Maintenance & PPM', path: '/operations/maintenance', icon: <BuildIcon sx={{color:'#1976d2'}}/> },
    { name: 'Transport & Tiffin', path: '/operations/transport', icon: <EmojiTransportationIcon sx={{color:'#1976d2'}}/> },
    { name: 'H.R.', path: '/operations/hr', icon: <ManSharpIcon sx={{color:'#1976d2'}}/> }
  ];
  const registration = [
    
    { name: 'Pre-Registration', path: '/enquiry/pre-registration', icon: <AssignmentIcon sx={{color:'#1976d2'}}/> },
    { name: 'Registration', path: '/enquiry/registration', icon: <AccountCircleIcon sx={{color:'#1976d2'}}/> },
  ];
  const billings = [
    { name: 'Billing', path: '/billings/billing', icon: <PaymentsIcon sx={{color:'#1976d2'}}/> },
    { name: 'Complaints', path: '/billings/complaint', icon: <ErrorOutlineSharpIcon sx={{color:'#1976d2'}}/> },

  ];

  const storesInventory=[
    { name: 'Inward-Outward', path: '/inventory/inward-outward', icon: <StorefrontTwoToneIcon sx={{color:'#1976d2'}}/> }
  ]

  const financeAccounts=[
    { name: 'Vouchers', path: '/accounts/vouchers', icon: <ReceiptTwoToneIcon sx={{color:'#1976d2'}}/> }
  ]

  const reports=[
    { name: 'Enq & Registration', path: '/reports/enq-registration', icon: <HowToRegTwoToneIcon sx={{color:'#1976d2'}}/> },
    { name: 'Operations', path: '/reports/operations', icon: <LocalActivityTwoToneIcon sx={{color:'#1976d2'}}/> },
    { name: 'Accounts & Finance', path: '/reports/accountsFinance', icon: <AccountBalanceTwoToneIcon sx={{color:'#1976d2'}}/> }
  ]

  const utilities=[
    { name: 'Communications', path: '/utilities/communications', icon: <ChatTwoToneIcon sx={{color:'#1976d2'}}/> },
  ]

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOutsideClick = (event) => {
    if (open && !event.target.closest('.MuiDrawer-paper') && !event.target.closest('.MuiIconButton-edgeStart')) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open]);
  const handleMastersClick = () => {
    setMastersOpen(!mastersOpen);
  };


  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);
  console.log(userName, '33')
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (path === '/masters') {
      setMastersOpen(!mastersOpen);
      setOperationsOpen(false);
      setEnquiryOpen(false);
    } else if (path === '/operations') {
      setOperationsOpen(!operationsOpen);
    } else if (path === '/enquiry') {
        setEnquiryOpen(!enquiryOpen)
    }else if(path==='/billings'){
      setBillingsOpen(!billingsOpen)
    }else if(path==='/inventory'){
     setInventoryOpen(!inventoryOpen)
    }else if(path==='/accounts'){
      setAccountOpen(!accountOpen)
     }else if(path==='/reports'){
      setReportsOpen(!reportsOpen)
     }else if(path==='/utilities'){
      setUtilitiesOpen(!utilitiesOpen)
     }
    else {
      setMastersOpen(false);
      setOperationsOpen(false);
    }
  };
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccountClick = () => {
    handleProfileClose();
    navigate('/changepassword');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    navigate('/HostelERPUI')
    handleProfileClose();
  };
  const handleSubMenuNavigation = (path) => {
    navigate(path);
    setOpen(true);
  };

  const handleDrawerEnter = () => {
    setOpen(true);
  };

  const handleDrawerLeave = () => {
    setOpen(false);
  };
  const handleDrawerToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" >
        <Toolbar>
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=>{setOpen(!open)}}
            onClick={toggleDrawer}
            edge="start"
          > */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
          // sx={{
          //   marginRight: 5,
          //   ...(open && { display: 'none' }),
          // }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} style={{ height: '30px' }} alt='logo' />
          </Typography>
          <IconButton
            onClick={handleProfileClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{userName.charAt(0).toUpperCase()}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            onClick={handleProfileClose}
          >
            <MenuItem onClick={handleMyAccountClick}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* <Drawer variant="permanent" open={open}> */}
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleDrawerEnter}
        onMouseLeave={handleDrawerLeave}
      >
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}> */}
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => handleNavigation('/dashboard')}>
            <ListItemButton
              selected={location.pathname === '/dashboard'}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <MdDashboard style={{ fontSize: '25px' ,color:'#7c3aed'}} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} >
            <ListItemButton
              onClick={() => handleNavigation('/masters')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <VscThreeBars style={{ fontSize: '25px',color:'#7c3aed' }} />
              </ListItemIcon>
              <ListItemText primary="Masters" sx={{ opacity: open ? 1 : 0 }} />
              {open && (mastersOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={mastersOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {mastersSubItems.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation('/enquiry')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <HowToRegIcon sx={{color:'#7c3aed'}}/>
              </ListItemIcon>
              <ListItemText primary="Enq & Registration" sx={{ opacity: open ? 1 : 0 }} />
              {open && (enquiryOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={enquiryOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {registration.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation('/billings')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletIcon sx={{color:'#7c3aed'}}/>
              </ListItemIcon>
              <ListItemText primary="Billing & Tickets" sx={{ opacity: open ? 1 : 0 }} />
              {open && (billingsOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={billingsOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {billings.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          {/* <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation('/complaint')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Complaint" sx={{ opacity: open ? 1 : 0 }} />
              {open && (complaintOpen ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            <Collapse in={complaintOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {Complainant.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem> */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => handleNavigation('/operations')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LocalActivityIcon sx={{color:'#7c3aed'}}/>
              </ListItemIcon>
              <ListItemText primary="Operations" sx={{ opacity: open ? 1 : 0 }} />
              {open && (operationsOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={operationsOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {operationsSubItems.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} >
            <ListItemButton
              // selected={location.pathname === '/inventory'}
              onClick={() => handleNavigation('/inventory')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <InventoryIcon style={{ fontSize: '25px' ,color:'#7c3aed'}} />
              </ListItemIcon>
              <ListItemText primary="Stores & Inventory" sx={{ opacity: open ? 1 : 0 }} />
              {open && (inventoryOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={inventoryOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {storesInventory.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
       
          <ListItem disablePadding sx={{ display: 'block' }} >
            <ListItemButton
              onClick={() => handleNavigation('/accounts')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceIcon style={{ fontSize: '25px' ,color:'#7c3aed'}} />
              </ListItemIcon>
              <ListItemText primary="Finance & Accounts" sx={{ opacity: open ? 1 : 0 }} />
              {open && (accountOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore  sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={accountOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {financeAccounts.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} >
            <ListItemButton
              onClick={() => handleNavigation('/reports')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LeaderboardIcon sx={{color:'#7c3aed'}}/>
              </ListItemIcon>
              <ListItemText primary="Reports" sx={{ opacity: open ? 1 : 0 }} />
              {open && (reportsOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={reportsOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {reports.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} >
            <ListItemButton
              onClick={() => handleNavigation('/utilities')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <OtherHousesIcon sx={{color:'#7c3aed'}}/>
              </ListItemIcon>
              <ListItemText primary="Utilities & Others" sx={{ opacity: open ? 1 : 0 }} />
              {open && (utilitiesOpen ? <ExpandLess sx={{ mr: '-10px' }}/> : <ExpandMore sx={{ mr: '-10px' }}/>)}
            </ListItemButton>
            <Collapse in={utilitiesOpen && open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {utilities.map((item, index) => (
                  <ListItemButton
                    key={index}
                    sx={{ pl: 4 }}
                    onClick={() => handleSubMenuNavigation(item.path)}
                    selected={location.pathname === item.path}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </ListItem>

        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

export default SidebarDrawar;