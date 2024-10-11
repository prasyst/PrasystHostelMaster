import React, { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-toastify';

const columns = [     // to add the row/heading to the tables 
    { id: 'coMstId', label: 'Co.Id', minWidth: 50 },
    { id: 'companyName', label: 'Company Name', minWidth: 170 },
    { id: 'gstin', label: 'GSTIN', minWidth: 170 },
    { id: 'cityName', label: 'City Name', minWidth: 150 },
    { id: 'cobrMstId', label: 'Cobr_Id', minWidth: 50 },
    { id: 'cobrName', label: 'Branch Name', minWidth: 150 },
    { id: 'cobr_GSTIN', label: 'Branch GST', minWidth: 150 },
    { id: 'cobr_CityName', label: 'Branch City', minWidth: 120 }
];

const PartyTable = () => {
    // define the useStates according to the useCase
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchTerms, setSearchTerms] = useState({});
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCompanyData = useCallback(async () => {   // making the api using callback for better performance
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}PartyMst/RetrivePartyMstAll`, {
                "PartyId": 0,
                "Flag": "R"
            });

            if (response.data.status === 0) {
                const formattedData = response.data.data.map(company => ({
                    ...company,
                    companyId: company.coMstId,
                    companyName: company.coName || '',
                    gstin: company.gstin,
                    cityName: company.cityName || '',
                    cobr_GSTIN: company.cobr_GSTIN
                }));
                console.log('for', formattedData)
                setRows(formattedData);
            } else {
                console.error('Error fetching company data:', response.data.message);
                toast.error('Failed to fetch data: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
            toast.error('An error occurred while fetching company data.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);

    const handleChangePage = (event, newPage) => {   // page changing function
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const handleClick = () => {
        navigate('/partymaster');
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
    const handleRowDoubleClick = (companyId) => {
        console.log('companyid', companyId)
        navigate('/company', { state: { companyId, mode: 'view' } });
    };
    const handleLocationclick = () => {
        navigate('/masters/arap')
    }
    return (
        <>
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
                            <Link onClick={handleHomeClick} className="text-d-none" underline="hover" color="inherit" sx={{ cursor: 'pointer' }}>
                                Home
                            </Link>
                            <Typography color="text.primary" onClick={handleLocationclick} sx={{ cursor: 'pointer' }}>AR/AP</Typography>
                            <Typography color="text.primary">Vendor Master</Typography>
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
                    <Paper sx={{ width: '90%', overflow: 'hidden', margin: '0px 0px 0px 50px', border: '1px solid lightgray' }}>
                        <TableContainer sx={{ maxHeight: 450 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            '& > th': {
                                                padding: '2px  10px 2px  10px',
                                                textAlign: 'center'
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
                                                    sx={{
                                                        mt: 1, margin: '0px', '& .MuiOutlinedInput-input': {
                                                            padding: '2px 6px',
                                                        },
                                                    }}

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
                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.companyId}
                                                    onDoubleClick={() => handleRowDoubleClick(row.companyId)}
                                                    style={{ cursor: 'pointer' }}
                                                    sx={{
                                                        '& > td': {
                                                            padding: '2px  14px 2px  19px',
                                                            // textAlign: 'center'
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
        </>
    )
}

export default PartyTable