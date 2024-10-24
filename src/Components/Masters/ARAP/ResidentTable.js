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
  { id: 'firstName', label: 'First Name', minWidth: 170 },
  { id: 'middleName', label: 'Middle Name', minWidth: 170 },
  { id: 'lastName', label: 'Last Name', minWidth: 170 },
  { id: 'gender', label: 'Gender', minWidth: 100 },
  { id: 'dob', label: 'D.O.B', minWidth: 170 },
  { id: 'mobileNo', label: 'Mobile No', minWidth: 170 },
  { id: 'alternateMobile', label: 'Alternate Mobile', minWidth: 170 },
  { id: 'email', label: 'Email Id', minWidth: 170 },
  { id: 'aadharNo', label: 'Aadhar No', minWidth: 170 },
  { id: 'panNo', label: 'Pan No', minWidth: 100 },
  { id: 'pinCode', label: 'Pincode', minWidth: 100 },
  { id: 'country', label: 'Country', minWidth: 100 },
];

export default function ResidentTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerms, setSearchTerms] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidentData();
  }, []);


  const fetchResidentData = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}ResidentMst/getAllResidentMstDashBoard`, {
        start: 1,
        PageSize: 1,
        SearchText: ""
      });
      
      if (response.data.status === 0) {
        const formattedData = response.data.data.map(resident => ({
          ...resident,
          firstName: resident.firstName || '', 
          middleName: resident.midName || '',
          lastName: resident.lastName || '',
          country: resident.countryName,
          gender:resident.gender,
          email:resident.email,
          dob:resident.dob,
          mobileNo:resident.mobile,
          aadharNo:resident.aadharNo
        }));
        setRows(formattedData);
      } else {
        console.error('Error fetching resident data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching resident data:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => {
    navigate('/resident');
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

  const handleRowDoubleClick = (residentId) => {
  console.log('id',residentId)
    navigate('/resident', { state: { residentId ,mode: 'view'}} );
  };
  const handleLocationclick=()=>{
    navigate('/masters/arap')
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
            <Typography color="text.primary" onClick={handleLocationclick} sx={{cursor:'pointer'}}>ARAP</Typography>
            <Typography color="text.primary">Resident Master</Typography>
          </Breadcrumbs>

          <Button
            variant="contained"
            onClick={handleClick}
            size='small'
            sx={{
              backgroundColor: '#635BFF',
              color: 'white',
              '&:hover': {
                backgroundColor: '#5249f',
              },
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.residentId}
                      onDoubleClick={() => handleRowDoubleClick(row.residentId)}
                      style={{ cursor: 'pointer' }}
                      sx={{ 
                        '& > td': { 
                          padding: '2px  14px 2px  19px',
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
}