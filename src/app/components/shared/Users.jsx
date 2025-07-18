'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import PageContainer from '@/app/components/container/PageContainer';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = allUsers.filter((user) =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            'x-access-token': token,
          },
        };

        const response = await axios.get(`${BASE_URL}/admin/content/showAllUsers`, config);
        setAllUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <PageContainer title="Users" description="List of all users">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <Paper elevation={3} sx={{ paddingY: 2, paddingX:1, maxWidth: '100%',  }}>
      {/* Header Section with Search */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          User List
        </Typography>
        <TextField
          label="Search by First Name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 250 }}
        />
      </Box>

      {/* Table */}
      <Table sx={{ minWidth: 650 ,  }} size="medium" aria-label="stylish users table">
        <TableHead sx={{ backgroundColor: '#f5f5f5'  }}>
          <TableRow>
            {[
              'First Name',
              'Last Name',
              'Email',
              'Phone',
              'Device',
              'City',
              'Country',
              'User Type',
            ].map((header) => (
              <TableCell key={header} sx={{ fontWeight: 700 }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8}>
                <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                  '&:hover': { backgroundColor: '#e3f2fd' },
                }}
              >
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.deviceType}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.userType}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8}>
                <Typography textAlign="center" py={3}>
                  No users found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
      </TableContainer>
    </PageContainer>
  );
};

export default Users;
