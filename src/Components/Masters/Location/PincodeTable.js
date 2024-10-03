import  React,{useState,useEffect} from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Breadcrumbs, Link, Typography, Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'pinCode', label: 'Pincode', minWidth: 170 },
  { id: 'area', label: 'Area', minWidth: 100 },
  { id: 'areaAbrv', label: 'Short Name', minWidth: 100 },
  { id: 'city', label: 'City Name', minWidth: 170 },
  { id: 'state', label: 'State', minWidth: 170 },
];

export default function PincodeTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerms, setSearchTerms] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPincodeData();
    handleSearch();
  }, []);

  const fetchPincodeData = async (searchText = "") => {
    try {
      const response = await axios.post('http://43.230.196.21/api/pincodeMst/getAllpincodeMstDashBoard', {
        start: 0,
        PageSize: 0,
        SearchText: searchText
      });
      
      if (response.data.status === 0) {
        const formattedData = response.data.data.map(pinCode => ({
          ...pinCode,
          area: pinCode.areaName || 'NA', 
          areaAbrv: pinCode.areaAbrv || 'NA',
          city: pinCode.cityName,
          state: pinCode.state
        }));
        setRows(formattedData);
        console.log("data", response);
      } else {
        console.error('Error fetching pincode data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching pincode data:', error);
    }
  };
  const handleSearch = () => {
    const citySearchTerm = searchTerms.city || '';
    fetchPincodeData(citySearchTerm);
  };

  // const fetchPincodeData = async () => {
  //   try {
  //     const response = await axios.post('http://43.230.196.21/api/pincodeMst/getAllpincodeMstDashBoard', {
  //       start: 1,
  //       PageSize: 1,
  //       SearchText: ""
  //     });
      
  //     if (response.data.status === 0) {
  //       const formattedData = response.data.data.map(pinCode => ({
  //         ...pinCode,
  //         area: pinCode.areaName || 'N/A', 
  //         areaAbrv: pinCode.areaAbrv || 'N/A',
  //         city:pinCode.cityName
  //       }));
  //       setRows(formattedData);
  //     } else {
  //       console.error('Error fetching pincode data:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching pincode data:', error);
  //   }
  // };

  // const handleSearch = () => {
  //   axios.post('http://43.230.196.21/api/pincodeMst/getAllpincodeMstDashBoard', {
  //     start: 0,
  //     PageSize: 0,
  //     SearchText: ''
  //   }, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   .then(response => {
  //     console.log('Search Results:', response.data);
  //     // setRows(response.data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate('/pincode');
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleSearchChange = (columnId, value) => {
    setSearchTerms(prev => ({ ...prev, [columnId]: value }));
    setPage(0);
  };

  const filteredRows = React.useMemo(() => {

    return rows.filter(row => {
      return Object.entries(searchTerms).every(([columnId, term]) => {
        if (!term) return true;
        const value = row[columnId];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(term);
        }
        return true;
      });
    });
  }, [searchTerms, rows]);

  const handleRowDoubleClick = (pinId) => {
  
    navigate('/pincode', { state: { pinId ,mode: 'view'}} );
  };

  const handleLocationclick=()=>{
    navigate('/masters/location')
  }

  return (
    <>
      <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}>
        <Box
          sx={{
            backgroundColor: '#e6edfc',
            padding: '20px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link onClick={handleHomeClick} className="text-d-none" underline="hover" color="inherit" sx={{cursor:'pointer'}}>
              Home
            </Link>
            <Typography color="text.primary" onClick={handleLocationclick} sx={{cursor:'pointer'}}>Location</Typography>

            <Typography color="text.primary">Pincode Master</Typography>

          </Breadcrumbs>

          <Button
            variant="contained"
            onClick={handleClick}
            sx={{
              backgroundColor: '#7c3aed ',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7c3aed ',
              },
              // margin: '0 56px 0 0'
            }}
          >
            Add New Record
          </Button>
        </Box>
        <Paper sx={{ width: '90%', overflow: 'hidden', margin: '0px 0px 0px 50px', border:'1px solid lightgray' }}>
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow
                  sx={{ 
                    '& > th': { 
                      padding: '2px  10px 2px  10px'
                    }
                  }}
                >
                  {columns.map((column) => (
                    <TableCell 
                      key={column.id} 
                      align={column.align} 
                      style={{ minWidth: column.minWidth }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {column.label}
                      </Typography>
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder={`Search ${column.label}`}
                        onChange={(e) => handleSearchChange(column.id, e.target.value)}
                        sx={{ mt: 1 ,margin:'0px' ,'& .MuiOutlinedInput-input': {
                          padding: '2px 6px',  
                        },}}
                      />
                    </TableCell>
                  ))}
                   <button style={{ marginTop: '33px'}} onClick={handleSearch}>
                     Search
                   </button>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.pinId}
                      onDoubleClick={() => handleRowDoubleClick(row.pinId)}
                      style={{ cursor: 'pointer' }}
                      sx={{ 
                        '& > td': { 
                          padding: '2px  14px 2px  10px'
                        }
                      }}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
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
            rowsPerPageOptions={[15, 20, 25, 100]}
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
}


