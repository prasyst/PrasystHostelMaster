import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  Menu,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  NavigateNext as NavigateNextIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CancelPresentation as CancelPresentationIcon,
} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import "../../../index.css";
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  StepConnector,
  List,
  ListItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ConfirmDialog } from "../../ReusablePopup/CustomModel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { z } from "zod";
import AuthHeader from "../../../Auth";

const steps = [
  "Property Details",
  "Floor Configuration",
  "Amenity Configuration",
];
const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderColor: "#e0e0e0",
    borderTopWidth: 3,
    borderRadius: 1,
    marginBottom: "20px",
  },
}));
const CustomStepIcon = styled("div")(({ theme, ownerState }) => ({
  width: 40,
  height: 40,
  border: "3px solid",
  borderColor: ownerState.active ? "#7c3aed" : "#e0e0e0",
  borderRadius: "50%",
  backgroundColor: "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: ownerState.active ? "#7c3aed" : "#999",
  fontSize: "1.2rem",
  fontWeight: "bold",
}));

const CustomStepLabel = styled(StepLabel)({
  flexDirection: "column",
  "& .MuiStepLabel-labelContainer": {
    marginTop: "5px",
  },
});

const formSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  PinId: z.string().length(6, "Pin Code must be 6 digits"),
  // Add other fields as needed
});

const columns = [
  { id: "wingName", label: "WingName", minWidth: 100 },
  { id: "floorName", label: "FloorName", minWidth: 100 },
  { id: "totalRooms", label: "Total Rooms", minWidth: 100 },
  { id: "startNo", label: "Start No.", minWidth: 100 },
];

const fields = [
  { id: "amenityName", label: "Amenity", minWidth: 170 },
  { id: "amenity_Desc", label: "Description", minWidth: 170 },
  { id: "floorName", label: "Floor", minWidth: 170 },
  { id: "areaSqFt", label: "AreaSqFt", minWidth: 100 },
];

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [mode, setMode] = useState("view");
  const [currentPropId, setCurrentPropId] = useState(null);
  const [propertyId, setPropertyId] = useState();
  const [hods, setHods] = useState([]);
  const [sites, setSites] = useState([]);
  const [propImg, setPropImg] = useState("");
  const [file, setFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [area, setArea] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [branch, setBranch] = useState([]);
  const [propType, setPropType] = useState([]);
  const [wings, setWings] = useState([]);
  const [floors, setFloors] = useState([]);
  const location = useLocation();
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerms, setSearchTerms] = useState({});
  const [amenityEntries, setAmenityEntries] = useState([]);
  const [rows, setRows] = useState([]);
  const [entries, setEntries] = useState([]);
  const [field, setField] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [editState, setEditState] = useState({});

  const [selectAll, setSelectAll] = useState(false);
  const [wingSelectAll, setWingSelectAll] = useState(false);
  const [amenitySelectAll, setAmenitySelectAll] = useState(false);

  // Toggle the "Select All" checkbox
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedItems = floors.map((item) => ({
      ...item,
      isChecked: newSelectAll,
    }));
    setFloors(updatedItems);
  };

  const wingsSelectAll = () => {
    const newSelectAll = !wingSelectAll;
    setWingSelectAll(newSelectAll);
    const updatedItems = wings.map((item) => ({
      ...item,
      isChecked: newSelectAll,
    }));
    setWings(updatedItems);
  };

  const amenitiesSelectAll = () => {
    const newSelectAll = !amenitySelectAll;
    setAmenitySelectAll(newSelectAll);
    const updatedItems = amenities.map((item) => ({
      ...item,
      isChecked: newSelectAll,
    }));
    setAmenities(updatedItems);
  };

  // Handle individual checkbox toggle
  const handleCheckboxChange = (id) => {
    const updatedItems = floors.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setFloors(updatedItems);

    // Update "Select All" checkbox based on individual selections
    const allChecked = updatedItems.every((item) => item.isChecked);
    setSelectAll(allChecked);
  };

  const wingCheckboxChange = (id) => {
    const updatedItems = wings.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setWings(updatedItems);

    const allChecked = updatedItems.every((item) => item.isChecked);
    setWingSelectAll(allChecked);
  };

  const amenityCheckboxChange = (id) => {
    const updatedItems = amenities.map((item) =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setAmenities(updatedItems);

    const allChecked = updatedItems.every((item) => item.isChecked);
    setAmenitySelectAll(allChecked);
  };

  useEffect(() => {
    console.log("111", location?.state?.propertyId);
    if (location.state && location.state?.propertyId) {
      setPropertyId(location.state.propertyId);
      fetchPropertyData(location.state?.propertyId);
      setMode("view");
    } else {
      setMode("add");
      setIsFormDisabled(false);
    }
  }, [location]);

  const fetchPropertyData = async (id, flag) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}PropertyMst/RetrivePropertyMst`,
        {
          propId: parseInt(id),
          Flag: flag,
        },
        AuthHeader()
      );

      if (
        response.data.Status === 0 &&
        response.data.responseStatusCode === 1
      ) {
        const propertyData = response.data.Data[0];
        console.log("propertyData", propertyData);
        setFormData({
          PropId: propertyData.PropId,
          CompanyName: propertyData.CompanyName,
          BranchName: propertyData.CobrMstId.toString(),
          PropName: propertyData.PropName,
          SqFt: propertyData.SqFt,
          PinCode: propertyData.PinId.toString(),
          AreaName: propertyData.AreaName,
          StateName: propertyData.StateName,
          CountryName: propertyData.CountryName,
          CityName: propertyData.CityId.toString(),
          PropEmail: propertyData.PropEmail,
          PropTel: propertyData.PropTel,
          propTypName: propertyData.PropTypeId.toString(),
          PropMob: propertyData.PropMob,
          TotalRooms: propertyData.TotalRooms,
          TotalBeds: propertyData.TotalBeds,
          PropImg: propertyData.PropImg,
          HodEmpName: propertyData.HodEmpId.toString(),
          WardenEmpName: propertyData.WardenEmpId.toString(),
          PropAdd: propertyData.PropAdd,
          PropGPSLoc: propertyData.PropGPSLoc,
          Status: propertyData.status || "1",
          remark: propertyData.remark || "",
          CreatedBy: propertyData.createdBy
            ? propertyData.createdBy.toString()
            : "1",
        });
        setIsFormDisabled(true);
        setPropertyId(propertyData?.propId);
      } else if (
        response.data.Status === 1 &&
        response.data.responseStatusCode === 2
      ) {
        toast.info(response.data.Message);
      } else {
        toast.error("Failed to fetch property data");
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      toast.error("Error fetching property data. Please try again.");
    }
  };

  const [formData, setFormData] = useState({
    CompanyName: "",
    BranchName: "",
    PropName: "",
    SelectqFt: "",
    Pincode: "",
    AreaName: "",
    CityName: "",
    StateName: "",
    CountryName: "",
    PropEmail: "",
    PropTel: "",
    PropTypName: "",
    PropMob: "",
    TotalRooms: "",
    TotalBeds: "",
    PropImg: "",
    HodEmpName: "",
    WardenEmpName: "",
    PropAdd: "",
    Name: "",
    PropGPSLoc: "",
    Status: "1",
    Remark: "",
    CreatedBy: "1",
  });

  const [formData1, setFormData1] = useState({
    WingName: "",
    FloorName: "",
    TotalRooms: "",
    StartNo: "",
  });

  const [formData2, setFormData2] = useState({
    AmenityName: "",
  });

  useEffect(() => {
    const fetchPropType = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}PropTypeMst/getMstPropTypedrp`,
          AuthHeader()
        );
        if (
          response.data.Status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setPropType(response.data.Data);
        } else {
          toast.error("Failed to fetch PropType");
        }
      } catch (error) {
        console.error("Error fetching PropType:", error);
        toast.error("Error fetching PropType. Please try again.");
      }
    };

    fetchPropType();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}CoMst/getCoMstdrp`,
          AuthHeader()
        );
        if (
          response.data.Status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setCompanies(response.data.Data);
        } else {
          toast.error("Failed to fetch CompanyName");
        }
      } catch (error) {
        console.error("Error fetching CompanyName:", error);
        toast.error("Error fetching CompanyName. Please try again.");
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchBranch = async (id) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}CoMst/getCoMstWiseCobrdrp`,
          {
            CoMstId: id,
          },
          AuthHeader()
        );
        if (
          response.data.Status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setBranch(response.data.Data);
        } else {
          toast.error("Failed to fetch Branch");
        }
      } catch (error) {
        console.error("Error fetching Branch:", error);
        toast.error("Error fetching Branch. Please try again.");
      }
    };

    if (formData.CompanyName) {
      fetchBranch(formData.CompanyName);
    }
  }, [formData.CompanyName]);

  useEffect(() => {
    const fetchArea = async (Pincode) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}pincodeMst/getdrppincodewisearea`,
          {
            pinCode: parseInt(Pincode),
          },
          AuthHeader()
        );
        if (
          response.data.Status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setArea(response.data.Data);
        } else {
          toast.error("Failed to fetch Area");
        }
      } catch (error) {
        console.error("Error fetching Area:", error);
        toast.error("Error fetching Area. Please try again.");
      }
    };

    if (formData.Pincode) {
      fetchArea(formData.Pincode);
    }
  }, [formData.Pincode]);

  useEffect(() => {
    const fetchPlaces = async (Pincode, AreaName) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}pincodeMst/getdrppincodeAreawise_datafill`,
          {
            Pincode: parseInt(Pincode),
            AreaName: AreaName,
          },
          AuthHeader()
        );
        if (
          response.data.Status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setSites(response.data.Data);
          const { cityName, stateName, countryName } = response.data.Data[0];
          setFormData((prevData) => ({
            ...prevData,
            CityName,
            StateName,
            CountryName,
          }));
        }
        // else {
        //   toast.error('Failed to fetch PincodeArea');
        // }
      } catch (error) {
        console.error("Error fetching PincodeArea:", error);
        toast.error("Error fetching PincodeArea. Please try again.");
      }
    };

    if (formData.PinCode && formData.AreaName) {
      fetchPlaces(formData.pinCode, formData.areaName);
    }
  }, [formData.pinCode, formData.areaName]);

  useEffect(() => {
    const fetchHods = async (flag) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}MstEmp/getMstEmpdrp`,
          {
            Flag: parseInt(1),
          },
          AuthHeader()
        );
        if (
          response.data.status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setHods(response.data.data);
        } else {
          toast.error("Failed to fetch Hods");
        }
      } catch (error) {
        console.error("Error fetching Hods:", error);
        toast.error("Error fetching Hods. Please try again.");
      }
    };

    fetchHods();
  }, []);

  useEffect(() => {
    const fetchWardens = async (flag) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}MstEmp/getMstEmpdrp`,
          {
            Flag: parseInt(2),
          },
          AuthHeader()
        );
        if (
          response.data.status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setWardens(response.data.data);
        } else {
          toast.error("Failed to fetch Wardens");
        }
      } catch (error) {
        console.error("Error fetching Wardens:", error);
        toast.error("Error fetching Wardens. Please try again.");
      }
    };

    fetchWardens();
  }, []);

  useEffect(() => {
    const fetchWings = async (flag) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}WingMst/getMstWingdrp`,
          {
            Flag: flag,
          },
          AuthHeader()
        );
        if (
          response.data.status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setWings(response.data.data);
        } else {
          toast.error("Failed to fetch Wings");
        }
      } catch (error) {
        console.error("Error fetching Wings:", error);
        toast.error("Error fetching Wings. Please try again.");
      }
    };

    fetchWings();
  }, []);

  useEffect(() => {
    const fetchFloors = async (flag) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}FloorMst/getFloorMstdrp`,
          {
            Flag: flag,
          },
          AuthHeader()
        );
        if (
          response.data.status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setFloors(response.data.data);
        } else {
          toast.error("Failed to fetch Floors");
        }
      } catch (error) {
        console.error("Error fetching Floors:", error);
        toast.error("Error fetching Floors. Please try again.");
      }
    };

    fetchFloors();
  }, []);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}AmenityMst/getMstAmenitydrp`,
          AuthHeader()
        );
        if (
          response.data.status === 0 &&
          response.data.responseStatusCode === 1
        ) {
          setAmenities(response.data.data);
        } else {
          toast.error("Failed to fetch Amenities");
        }
      } catch (error) {
        console.error("Error fetching Amenities:", error);
        toast.error("Error fetching Amenities. Please try again.");
      }
    };

    fetchAmenities();
  }, []);

  // useEffect(() => {
  //   GetSourceName()
  //   GetSemesterName()
  //   GetInstituteeName()
  //   GetCourceName()
  //   getJobTitle()
  // }, [])

  // useEffect(() => {
  //   fetchFloorConfig();
  // }, []);

  // const fetchFloorConfig = async (id) => {
  //   console.log("Iddd", id)
  //   try {
  //     const response = await axios.post('http://43.230.196.21/api/MstPropFloorConfig/GetMstPropFloorConfigDashBoard', {
  //       propId: id,
  //       wingId: id
  //     });

  //     if (response.data.status === 0) {
  //       const formattedData = response.data.data.map(floorConfig => ({
  //         ...floorConfig,
  //         wingName: floorConfig.wingName,
  //         floorName: floorConfig.floorName,
  //         totalRooms: floorConfig.totalRooms,
  //         startNo: floorConfig.startNo
  //       }));
  //       setRows(formattedData);
  //     } else {
  //       console.error('Error fetching floor configuration data:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching floor configuration data:', error);
  //   }
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate("/floor");
  };

  const handleSearchChange = (columnId, value) => {
    setSearchTerms((prev) => ({ ...prev, [columnId]: value }));
    setPage(0);
  };

  const handleEditChange = (propertyId, columnId, newValue) => {
    setEditState((prevState) => ({
      ...prevState,
      [propertyId]: {
        ...prevState[propertyId],
        [columnId]: newValue, // Update only the specific column
      },
    }));
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      return Object.entries(searchTerms).every(([columnId, term]) => {
        if (!term) return true;
        const value = row[columnId];
        if (typeof value === "string") {
          return value.toLowerCase().includes(term.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(term);
        }
        return true;
      });
    });
  }, [searchTerms, rows]);

  const filteredEntries = React.useMemo(() => {
    return entries.filter((row) => {
      return Object.entries(searchTerms).every(([columnId, term]) => {
        if (!term) return true;
        const value = row[columnId];
        if (typeof value === "string") {
          return value.toLowerCase().includes(term.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(term);
        }
        return true;
      });
    });
  }, [searchTerms, entries]);

  const handleRowDoubleClick = () => {
    navigate("", { state: { mode: "view" } });
  };

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log("2", event.target.value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const handleInputValue = (event) => {
    const { name, value } = event.target;
    console.log("3", event.target.value);
    setFormData1((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeValue = (event) => {
    const { name, value } = event.target;
    console.log("4", event.target.value);
    setFormData2((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateStep = (step) => {
    let stepValid = true;
    let newErrors = {};

    if (step === 0) {
      try {
        formSchema.parse(formData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            newErrors[err.path[0]] = err.message;
          });
          stepValid = false;
        }
      }
    }

    setErrors(newErrors);
    return stepValid;
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(
      "55",
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    );
  };

  const handleNextdata = async () => {
    if (propertyId) {
      await fetchPropertyData(propertyId, "N");
    }
  };

  const handleBackdata = async () => {
    if (propertyId && propertyId > 1) {
      await fetchPropertyData(propertyId, "P");
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = () => {
    const selectedFloors = floors.filter((item) => item.isChecked);
    const selectedWings = wings.filter((item) => item.isChecked);

    const dataToDisplay = [];

    selectedFloors.forEach((floor) => {
      selectedWings.forEach((wing) => {
        dataToDisplay.push({
          floorId: floor.floorId,
          floorName: floor.name,
          wingId: wing.wingId,
          wingName: wing.name,
        });
      });
    });

    setRows(dataToDisplay);

    // Reset the checkboxes
    const resetFloors = floors.map((floor) => ({
      ...floor,
      isChecked: false,
    }));

    const resetWings = wings.map((wing) => ({
      ...wing,
      isChecked: false,
    }));

    // Update the state with the reset arrays
    setFloors(resetFloors);
    setWings(resetWings);

    setWingSelectAll(false);
    setSelectAll(false);

    setOpenConfirmDialog(false);
  };

  const amenitySelect = () => {
    const selectedAmenities = amenities.filter((item) => item.isChecked);

    const dataToDisplay = [];

    selectedAmenities.forEach((amenity) => {
      dataToDisplay.push({
        amenityId: amenity.amenityId,
        amenityName: amenity.name,
      });
    });

    setEntries(dataToDisplay);

    const resetAmenities = amenities.map((amenity) => ({
      ...amenity,
      isChecked: false,
    }));

    setAmenities(resetAmenities);

    setAmenitySelectAll(false);
  };

  const handleSubmit = async () => {
    const payload = {
      PropId: propertyId || 0,
      companyName: parseInt(formData.companyName),
      cobrMstId: parseInt(formData.branchName),
      propName: formData.propName,
      sqFt: formData.sqFt,
      pinId: parseInt(formData.pinId),
      pinId: parseInt(formData.pinCode),
      // pincode: formData.pincode,
      areaName: formData.areaName,
      cityId: parseInt(formData.cityName) || 1,
      // stateName: formData.stateName,
      // countryName: formData.countryName,
      propEmail: formData.propEmail,
      propTel: formData.propTel,
      propTypeId: parseInt(formData.propTypName),
      propMob: formData.propMob,
      totalRooms: formData.totalRooms,
      totalBeds: formData.totalBeds,
      propImg: formData.propImg,
      hodEmpId: parseInt(formData.hodEmpName),
      wardenEmpId: parseInt(formData.wardenEmpName),
      propAdd: formData.propAdd,
      propGPSLoc: formData.propGPSLoc,
      Status: formData.Status || "1",
      Remark: formData.remark || "",
      CreatedBy: "1",
      UpdatedBy: "1", // Include this for update operations
    };

    console.log("formData", formData);

    const payload1 = {
      PropId: propertyId || 0,
      wingId: parseInt(formData1.wingName),
      floorId: parseInt(formData1.floorName),
      totalRooms: parseInt(formData1.totalRooms),
      startNo: parseInt(formData1.startNo),
    };

    // const jsonString = '{ "PropFloorConfig":[ { "propId": 4, "wingId": 2, "floorId": 5, "totalRooms": 50, "startNo":2 }, { "propId": 12, "wingId": 13, "floorId": 13, "totalRooms": 20, "startNo": 4001 } ]}';

    // // Parse the JSON string
    // const parsedJson = JSON.parse(jsonString);

    const result = {
      PropFloorConfig: [payload1],
    };

    console.log("formData1", formData1);

    const payload2 = {
      PropId: propertyId || 0,
      amenityId: parseInt(formData2.amenityName),
    };

    console.log("Payload2:", payload2);

    let jsonData = JSON.stringify(result);

    jsonData = jsonData.replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
    jsonData = '"' + jsonData + '"';

    console.log(jsonData, "jsonData2");

    try {
      const response = await axios.post(
        "http://43.230.196.21/api/MstPropFloorConfig/ManageMstPropFloorConfig",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        AuthHeader()
      );
      toast.success(response.data.message);
      setActiveStep(0);
      if (isEditing) {
        setIsEditing(false);
        setMode("view");
        setIsFormDisabled(true);
      } else {
        if (response.data.data && response.data.data.propId) {
          const newPropertyId = response.data.data.propId;
          console.log("new", newPropertyId);
          setPropertyId(newPropertyId);
          await fetchPropertyData(newPropertyId, "R");
          console.log("newPropertyId", newPropertyId);
        }
        setMode("view");
        setIsFormDisabled(true);
      }
    } catch (error) {
      toast.error("Error submitting form");
    }
  };

  const handleAdd = () => {
    setMode("add");
    setIsFormDisabled(false);
    setPropertyId(null);
    setFormData({
      companyName: "",
      branchName: "",
      propName: "",
      sqFt: "",
      pinCode: "",
      areaName: "",
      cityName: "",
      stateName: "",
      countryName: "",
      propEmail: "",
      propTel: "",
      propTypName: "",
      propMob: "",
      totalRooms: "",
      totalBeds: "",
      propImg: "",
      hodEmpName: "",
      wardenEmpName: "",
      propAdd: "",
      propGPSLoc: "",
      Status: "1",
      remark: "",
      CreatedBy: "1",
    });

    setFormData1({
      wingName: "",
      floorName: "",
      totalRooms: "",
      startNo: "",
    });

    setFormData2({
      amenityName: "",
    });
    setActiveStep(0);
    setErrors({});
    setPropImg("");

    toast.info("Form cleared for new entry");
  };

  const handleEdit = () => {
    setMode("edit");
    setIsFormDisabled(false);
  };

  const handleSave = () => {
    // Implement save logic
    setMode("view");
  };

  const handleCancel = async () => {
    if (mode === "add") {
      try {
        await fetchPropertyData(1, "L");
        setMode("view");
        setIsFormDisabled(true);
      } catch (error) {
        toast.error("Error occurred while cancelling. Please try again.");
      }
    } else if (mode === "edit") {
      if (propertyId) {
        await fetchPropertyData(propertyId);
      }
      setMode("view");
      setIsFormDisabled(true);
    }
  };

  const deleteItem = () => {
    setOpenConfirmDialog(true);
  };

  const closeConfirmation = () => {
    setOpenConfirmDialog(false);
  };

  const onDeleteConfirm = async () => {
    try {
      await fetchPropertyData(propertyId, "D");
      // toast.success('Data deleted successfully');
      await fetchPropertyData(propertyId, "N");
      setMode("view");
      setIsFormDisabled(true);
    } catch (error) {
      toast.error("Error deleting property. Please try again.");
    }
    setOpenConfirmDialog(false);
  };

  const handleDelete = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetchPropertyData(propertyId, "D");
      // toast.success('Data deleted successfully');
      await fetchPropertyData(propertyId, "N");
      setMode("view");
      setIsFormDisabled(true);
    } catch (error) {
      toast.error("Error deleting property. Please try again.");
    }
    setIsConfirmDialogOpen(false);
  };

  const handleExit = () => {
    navigate("/propertytable");
  };

  // Handle file input change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Use a Promise to handle the file reading
      const readFileAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result); // This will be the Base64 string
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      // Read the file and update the state
      readFileAsBase64(file)
        .then((base64String) => {
          setFormData((prevData) => ({
            ...prevData,
            propImg: base64String,
          }));
        })
        .catch((err) => {
          console.error("Error reading file:", err);
          toast.error("Error reading file. Please try again.");
        });
    }
  };

  const renderStepContent = (step) => {
    return (
      <Box sx={{ height: "350px", overflowY: "scroll", padding: "16px" }}>
        {(() => {
          switch (step) {
            case 0:
              return (
                <Grid container spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid item lg={12} md={12} xs={12}>
                          {/* <Grid container spacing={3}> */}
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6} className="form_field">
                                <FormControl
                                  variant="filled"
                                  fullWidth
                                  className="custom-select"
                                >
                                  <InputLabel id="companyName-select-label">
                                    Company Name
                                  </InputLabel>
                                  <Select
                                    labelId="companyName-select-label"
                                    id="companyName-select"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    className="custom-textfield"
                                  >
                                    {companies.map((companyName) => (
                                      <MenuItem
                                        key={companyName.id}
                                        value={companyName.id}
                                      >
                                        {companyName.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} md={6} className="form_field">
                                <FormControl
                                  variant="filled"
                                  fullWidth
                                  className="custom-select"
                                >
                                  <InputLabel id="branchName-select-label">
                                    Branch
                                  </InputLabel>
                                  <Select
                                    labelId="branchName-select-label"
                                    id="branchName-select"
                                    name="branchName"
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                    className="custom-textfield"
                                  >
                                    {branch.map((branchName) => (
                                      <MenuItem
                                        key={branchName.id}
                                        value={branchName.id}
                                      >
                                        {branchName.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Property Name"
                              name="propName"
                              value={formData.propName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <FormControl
                              variant="filled"
                              fullWidth
                              className="custom-select"
                            >
                              <InputLabel id="propTypName-select-label">
                                Property Type
                              </InputLabel>
                              <Select
                                labelId="propTypName-select-label"
                                id="propTypName-select"
                                name="propTypName"
                                value={formData.propTypName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {propType.map((propTypeName) => (
                                  <MenuItem
                                    key={propTypeName.id}
                                    value={propTypeName.id}
                                  >
                                    {propTypeName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Sq.Ft Area"
                              name="sqFt"
                              value={formData.sqFt}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Pincode"
                              name="pinCode"
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>

                          <Grid item xs={12} md={6} className="form_field">
                            <FormControl
                              variant="filled"
                              fullWidth
                              className="custom-select"
                            >
                              <InputLabel id="areaName-select-label">
                                Area
                              </InputLabel>
                              <Select
                                labelId="areaName-select-label"
                                id="areaName-select"
                                name="areaName"
                                value={formData.areaName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {area.length > 0 ? (
                                  area.map((areaItem) => (
                                    <MenuItem
                                      key={areaItem.id}
                                      value={areaItem.name}
                                    >
                                      {areaItem.name}
                                    </MenuItem>
                                  ))
                                ) : (
                                  <MenuItem value="" disabled>
                                    No areas available
                                  </MenuItem>
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      lg={4}
                      md={4}
                      xs={12}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
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
                        {formData.propImg ? (
                          <img
                            src={formData.propImg}
                            alt="Uploaded Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{ textAlign: "center" }}
                          >
                            Image Preview
                          </Typography>
                        )}
                      </Box>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-photo"
                        type="file"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="upload-photo">
                        <Button
                          // variant="contained"
                          component="span"
                          style={{ marginTop: "5px" }}
                        >
                          Upload Image
                        </Button>
                      </label>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="City"
                              name="cityName"
                              value={formData.cityName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="State"
                              name="stateName"
                              value={formData.stateName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Country"
                              name="countryName"
                              value={formData.countryName}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Email ID"
                              name="propEmail"
                              value={formData.propEmail}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Tel No"
                              name="propTel"
                              value={formData.propTel}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Mobile No"
                              name="propMob"
                              value={formData.propMob}
                              onChange={handleInputChange}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid item lg={8} md={8} xs={12}>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Grid item lg={12} md={12} xs={12}>
                          {/* <Grid container spacing={3}> */}
                          <Box display="flex" flexDirection="column" gap={2}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="No Of Rooms"
                                  name="totalRooms"
                                  value={formData.totalRooms}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <TextField
                                  fullWidth
                                  label="No Of Beds"
                                  name="totalBeds"
                                  value={formData.totalBeds}
                                  onChange={handleInputChange}
                                  variant="filled"
                                  disabled={isFormDisabled}
                                  className="custom-textfield"
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6} className="form_field">
                            <FormControl
                              variant="filled"
                              fullWidth
                              className="custom-select"
                            >
                              <InputLabel id="hodEmpName-select-label">
                                HOD
                              </InputLabel>
                              <Select
                                labelId="hodEmpName-select-label"
                                id="hodEmpName-select"
                                name="hodEmpName"
                                value={formData.hodEmpName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {hods.map((hodEmpName) => (
                                  <MenuItem
                                    key={hodEmpName.id}
                                    value={hodEmpName.id}
                                  >
                                    {hodEmpName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6} className="form_field">
                            <FormControl
                              variant="filled"
                              fullWidth
                              className="custom-select"
                            >
                              <InputLabel id="wardenEmpName-select-label">
                                Warden
                              </InputLabel>
                              <Select
                                labelId="wardenEmpName-select-label"
                                id="wardenEmpName-select"
                                name="wardenEmpName"
                                value={formData.wardenEmpName}
                                onChange={handleInputChange}
                                className="custom-textfield"
                              >
                                {wardens.map((wardenEmpName) => (
                                  <MenuItem
                                    key={wardenEmpName.id}
                                    value={wardenEmpName.id}
                                  >
                                    {wardenEmpName.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={12} lg={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              name="propAdd"
                              value={formData.propAdd}
                              onChange={handleInputChange}
                              multiline
                              rows={2}
                              variant="filled"
                              disabled={isFormDisabled}
                              className="custom-textfield"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "100px",
                                  width: "340px",
                                },
                                "& .MuiInputBase-input": {
                                  resize: "vertical",
                                },
                                "& .MuiFilledInput-root": {
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                  },
                                  "&.Mui-focused": {
                                    backgroundColor: "transparent",
                                  },
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              );
            case 1:
              return (
                <>
                  <Box sx={{ maxWidth: "100vw", overflowX: "hidden" }}>
                    <Grid
                      container
                      gap={2}
                      sx={{
                        padding: "20px 30px",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={deleteItem}
                        sx={{
                          backgroundColor: "#7c3aed ",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#7c3aed ",
                          },
                        }}
                      >
                        Add Floor
                      </Button>
                      <Button
                        variant="contained"
                        onClick={deleteItem}
                        sx={{
                          backgroundColor: "#7c3aed ",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#7c3aed ",
                          },
                        }}
                      >
                        Clear All
                      </Button>
                    </Grid>
                    <Paper
                      sx={{
                        width: "100%",
                        overflow: "hidden",
                        margin: "0px 0px 0px 0px",
                        border: "1px solid lightgray",
                      }}
                    >
                      <TableContainer sx={{ maxHeight: 450 }}>
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow
                              sx={{
                                "& > th": {
                                  padding: "2px  10px 2px  24px",
                                },
                              }}
                            >
                              {columns.map((column) => (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    {column.label}
                                  </Typography>
                                  <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder={`Search ${column.label}`}
                                    onChange={(e) =>
                                      handleSearchChange(
                                        column.id,
                                        e.target.value
                                      )
                                    }
                                    sx={{
                                      mt: 1,
                                      margin: "0px",
                                      "& .MuiOutlinedInput-input": {
                                        padding: "2px 6px",
                                      },
                                    }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredRows
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.propertyId}
                                    onDoubleClick={() =>
                                      handleRowDoubleClick(row)
                                    }
                                    style={{ cursor: "pointer" }}
                                    sx={{
                                      "& > td": {
                                        padding: "2px  14px 2px  24px",
                                      },
                                    }}
                                  >
                                    {columns.map((column) => {
                                      const value =
                                        editState[row.propertyId]?.[
                                          column.id
                                        ] ?? row[column.id];
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                        >
                                          {["totalRooms", "startNo"].includes(
                                            column.id
                                          ) ? (
                                            <TextField
                                              size="small"
                                              value={value}
                                              onChange={(e) =>
                                                handleEditChange(
                                                  row.propertyId,
                                                  column.id,
                                                  e.target.newValue
                                                )
                                              }
                                              sx={{
                                                "& .MuiOutlinedInput-input": {
                                                  padding: "2px 6px",
                                                },
                                              }}
                                            />
                                          ) : (
                                            value
                                          )}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 100]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Paper>
                  </Box>
                </>
              );
            case 2:
              return (
                <>
                  <Box sx={{ maxWidth: "100vw" }}>
                    <Grid item lg={12} md={12} xs={12}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        gap={2}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={2} className="form_field">
                            <List>
                              <ListItem
                                style={{ height: "200px", width: "200px" }}
                              >
                                <div>
                                  <h3>Select Amenities</h3>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={amenitySelectAll}
                                      onChange={amenitiesSelectAll}
                                    />
                                    Select All
                                  </label>

                                  {amenities.map((item) => (
                                    <div key={item.id}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={item.isChecked}
                                          onChange={() =>
                                            amenityCheckboxChange(item.id)
                                          }
                                        />
                                        {item.name}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </ListItem>
                            </List>
                            <Grid sx={{ marginTop: "20px" }}>
                              <Button
                                sx={{
                                  backgroundColor: "#635BFF",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#1565c0",
                                    color: "white",
                                  },
                                }}
                                onClick={amenitySelect}
                              >
                                Confirm
                              </Button>
                              <Button
                                sx={{
                                  backgroundColor: "#635BFF",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "#1565c0",
                                    color: "white",
                                  },
                                  marginLeft: "10px",
                                }}
                                onClick={closeConfirmation}
                              >
                                Cancel
                              </Button>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={10} className="form_field">
                            <Paper
                              sx={{
                                width: "90%",
                                overflow: "hidden",
                                margin: "0px 0px 0px 50px",
                                border: "1px solid lightgray",
                              }}
                            >
                              <TableContainer sx={{ maxHeight: 450 }}>
                                <Table stickyHeader aria-label="sticky table">
                                  <TableHead>
                                    <TableRow
                                      sx={{
                                        "& > th": {
                                          padding: "2px  10px 2px  10px",
                                        },
                                      }}
                                    >
                                      {fields.map((column) => (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{ minWidth: column.minWidth }}
                                        >
                                          <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                          >
                                            {column.label}
                                          </Typography>
                                          <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder={`Search ${column.label}`}
                                            onChange={(e) =>
                                              handleSearchChange(
                                                column.id,
                                                e.target.value
                                              )
                                            }
                                            sx={{
                                              mt: 1,
                                              margin: "0px",
                                              "& .MuiOutlinedInput-input": {
                                                padding: "2px 6px",
                                              },
                                            }}
                                          />
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {filteredEntries
                                      .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                      )
                                      .map((row) => {
                                        return (
                                          <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.PropId}
                                            onDoubleClick={() =>
                                              handleRowDoubleClick(
                                                row.PropId
                                              )
                                            }
                                            style={{ cursor: "pointer" }}
                                            sx={{
                                              "& > td": {
                                                padding: "2px  14px 2px  19px",
                                              },
                                            }}
                                          >
                                            {fields.map((column) => {
                                              const value = row[column.id];
                                              return (
                                                <TableCell
                                                  key={column.id}
                                                  align={column.align}
                                                >
                                                  {value}
                                                </TableCell>
                                              );
                                            })}
                                          </TableRow>
                                        );
                                      })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              <TablePagination
                                rowsPerPageOptions={[5, 10, 15, 100]}
                                component="div"
                                count={filteredRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                              />
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Box>
                </>
              );
            default:
              return null;
          }
        })()}
      </Box>
    );
  };
  const handleStepClick = (step) => {
    if (mode === "view") {
      setActiveStep(step);
    }
  };

  return (
    <Grid>
      <Box className="form-container">
        <ToastContainer />
        <Grid container spacing={2} className="rasidant_grid">
          <Grid
            item
            xs={12}
            className="form_title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Grid>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#635BFF" }}
                className="three-d-button-previous"
                onClick={handleBackdata}
                disabled={activeStep.length === 0 || mode !== "view"}
              >
                <KeyboardArrowLeftIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                className="three-d-button-next"
                sx={{ backgroundColor: "#635BFF", margin: "0px 10px" }}
                onClick={handleNextdata}
                disabled={activeStep === steps.length - 1 || mode !== "view"}
              >
                <NavigateNextIcon />
              </Button>
            </Grid>

            <Typography variant="h5">Property Master</Typography>

            <Grid sx={{ display: "flex", justifyContent: "end" }}>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed" }}
                onClick={handleAdd}
                disabled={mode !== "view"}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
                onClick={handleEdit}
                disabled={mode !== "view"}
              >
                <EditIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed" }}
                onClick={handleDelete}
                disabled={mode !== "view"}
              >
                <DeleteIcon />
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ backgroundColor: "#7c3aed", margin: "0px 10px" }}
                onClick={handleExit}
                disabled={mode !== "view"}
              >
                <CancelPresentationIcon />
              </Button>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Stepper
              activeStep={activeStep}
              connector={<CustomStepConnector />}
            >
              {steps.map((label, index) => (
                <Step
                  key={label}
                  onClick={() => handleStepClick(index)}
                  style={{ cursor: mode === "view" ? "pointer" : "default" }}
                >
                  <CustomStepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon
                        ownerState={{ ...props, active: activeStep === index }}
                      >
                        {index + 1}
                      </CustomStepIcon>
                    )}
                  >
                    {label}
                  </CustomStepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>

          <Grid item xs={12}>
            {renderStepContent(activeStep)}
          </Grid>

          <Grid item xs={12} className="form_button">
            <Button
              variant="contained"
              size="small"
              // sx={{ backgroundColor: '#7c3aed', mr: 1 }}
              sx={{
                mr: 1,
                background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
              }}
              onClick={handleBack}
              disabled={activeStep === 0 || !mode === "view"}
            >
              {/* {activeStep === steps.length - 1 ? 'Previous' : ''} */}
              Previous
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              // sx={{ mr: 1 }}
              sx={{
                mr: 1,
                background: "linear-gradient(290deg, #d4d4d4, #d4d4d4)",
              }}
              disabled={!mode === "view"}
            >
              {activeStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
            <Button
              variant="contained"
              onClick={handleCancel}
              // sx={{ mr: 1 }}
              disabled={mode === "view"}
              sx={{
                mr: 1,
                background: "linear-gradient(290deg, #b9d0e9, #e9f2fa)",
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        title="Confirm Delete"
        content="Are you sure you want to delete this data?"
        onConfirm={handleConfirmDelete}
      />

      {/* Floor Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={closeConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            // width: '500%',
            // height: '600px',
            padding: "10px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Grid item lg={12} md={12} xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              style={{
                border: "5px solid transparent",
                backgroundImage: "linear-gradient(to right, #3498db, #9b59b6)",
                backgroundClip: "padding-box",
                borderRadius: "15px",
              }}
              gap={2}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} className="form_field">
                  <List>
                    <ListItem>
                      <div
                        style={{
                          height: "400px",
                          width: "200px",
                          overflowY: "auto",
                          position: "relative",
                          bottom: 10,
                        }}
                      >
                        <h3>Wings</h3>
                        <label>
                          <input
                            type="checkbox"
                            checked={wingSelectAll}
                            onChange={wingsSelectAll}
                          />
                          All
                        </label>

                        {wings.map((item) => (
                          <div key={item.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => wingCheckboxChange(item.id)}
                              />
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6} className="form_field">
                  <List>
                    <ListItem>
                      <div
                        style={{
                          height: "375px",
                          width: "200px",
                          overflowY: "auto",
                          position: "relative",
                          bottom: 10,
                        }}
                      >
                        <h3>Floors</h3>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                          All
                        </label>

                        {floors.map((item) => (
                          <div key={item.id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </DialogTitle>

        <DialogActions>
          <Button
            sx={{
              backgroundColor: "#635BFF",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
                color: "white",
              },
            }}
            onClick={handleSelect}
          >
            Confirm
          </Button>
          <Button
            sx={{
              backgroundColor: "#635BFF",
              color: "white",
              "&:hover": {
                backgroundColor: "#1565c0",
                color: "white",
              },
            }}
            onClick={closeConfirmation}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StepperForm;
{
  /* <Button
  variant="contained"
  onClick={handleClick}
  size='small'
  sx={{
    backgroundColor: '#635BFF',
    color: 'white',
    '&:hover': {
      backgroundColor: '#5249f',
    },
    height: '22.5px',
    bottom: 2
  }}
>
  Delete
</Button>  */
}
