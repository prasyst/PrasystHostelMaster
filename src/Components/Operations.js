import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import img1 from "../assets/Images/hostel1111.PNG";
import img2 from "../assets/Images/hostel.jpg"
import { Link } from "react-router-dom";
import { textAlign } from "@mui/system";
import './operation.css';
import { TbSum } from "react-icons/tb";
import { BsRadioactive } from "react-icons/bs";
import { TbRadioactiveOff } from "react-icons/tb";
import HouseKeepingType  from "./Masters/Operations/HKType"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Operations = () => {
  const names = [
    "House Keeping Type",
    "Machine Master",
    "House Keeping ",
    "Maintenance Type",
    "Vehicle Master",
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {/* <Grid item xs={3}>
              <Item>
                <img 
                  src={img1} 
                  alt='' 
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                />
                  <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                  <Link to='#'>House Keeping Type</Link>
                </Box>
              </Item>
            </Grid> */}

            <Grid item xs={3}>
              <Item > 
              <Box sx={{ textAlign: "center", marginTop: "10px" }} className="link">
                  <Link to="/hkTypeTable">House Keeping Type</Link>
                </Box> 
                 <div className="All-div"> 
                   <div  className="div-style" >
                   <div className="single-text"><TbSum  style={{color : 'rgb(124, 58, 237)' ,fontSize: '20px'}}/> <span>Total Count: 10 </span></div>
                   <div  className="single-text"><BsRadioactive  style={{color : 'rgb(124, 58, 237)',fontSize: '20px'}}/> <span>Active Count: 9</span> </div>
                   <div  className="single-text"><TbRadioactiveOff  style={{color : 'rgb(124, 58, 237)',fontSize: '20px'}}/> <span>InActive Count: 7</span> </div>
                </div>
                   <img
                  src={img2}
                  alt=""
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                  }}
                />
                </div>
                
                
              </Item>
            </Grid>
            
            <Grid item xs={3}>
              <Item>
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                  <Link to="#">Machine Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                  <Link to="#">House Keeping </Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />

                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                  <Link to="#">Maintenance Type</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <Item>
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />

                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                  <Link to="#">Maintenance Master</Link>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <img
                  src={img1}
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />

                <Box sx={{ textAlign: "center", marginTop: 1 }}>
                  <Link to="#">Vehicle Master</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Operations;
