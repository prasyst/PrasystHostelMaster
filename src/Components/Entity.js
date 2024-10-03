import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import img1 from "../assets/Images/hostel.jpg";
import { Link } from "react-router-dom";
import { textAlign } from "@mui/system";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Entity = () => {
  const names = ["Country", "State", "Zone/Region", "City", "Pincode"];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={2}>
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
                  <Link to="">Wing</Link>
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
                  <Link to="">Floor</Link>
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
                  <Link to="">Room Type</Link>
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
                  <Link to="">Room View</Link>
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
                  <Link to="">Room Bed </Link>
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
                  <Link to="">Room Master</Link>
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
                  <Link to="">Room Bed Number</Link>
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
                  <Link to="">Facilities Master</Link>
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
                  <Link to="">Room Type Facilities Link</Link>
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
                  <Link to="">Room Facility Link</Link>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Entity;
