'use client';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import PageContainer from '@/app/components/container/PageContainer';

import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { CustomizerContext } from '@/app/context/customizerContext';

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { activeMode } = useContext(CustomizerContext);
  const isDark = activeMode === 'dark';

  useEffect(() => {
    try {
      const storedUser =
        typeof window !== 'undefined'
          ? JSON.parse(sessionStorage.getItem('user') || 'null')
          : null;

      setToken(storedUser?.data?.adminToken || '');
    } catch (error) {
      console.error('Session parse error:', error);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/admin/content/showAllUsers`, {
          headers: {
            'x-access-token': token,
          },
        });

        setAllUsers(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const filteredUsers = allUsers.filter((user) => {
    const keyword = searchTerm.toLowerCase();

    return (
      user?.firstName?.toLowerCase().includes(keyword) ||
      user?.lastName?.toLowerCase().includes(keyword) ||
      user?.email?.toLowerCase().includes(keyword) ||
      user?.phoneNumber?.toLowerCase().includes(keyword) ||
      user?.city?.toLowerCase().includes(keyword) ||
      user?.country?.toLowerCase().includes(keyword)
    );
  });

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <PageContainer title="Users" description="List of all users">
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
            backgroundColor: isDark ? '#1e1e2f' : '#fff',
            color: isDark ? '#fff' : '#111827',
            boxShadow: isDark ? 'none' : '0 10px 30px rgba(0,0,0,0.06)',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Users
              </Typography>
              <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
                View and search all registered users.
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, phone, city, or country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: isDark ? '#25253a' : '#fafafa',
                },
              }}
            />
          </Box>

          <TableContainer
            sx={{
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: isDark ? '#25253a' : '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 700, width: 80 }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>First Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Last Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Device</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                        <CircularProgress size={28} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user, index) => (
                    <TableRow key={user.id || index} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{user.firstName || '-'}</TableCell>
                      <TableCell>{user.lastName || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell>{user.deviceType || '-'}</TableCell>
                      <TableCell>{user.city || '-'}</TableCell>
                      <TableCell>{user.country || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}
                      >
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
              sx={{
                borderTop: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                '& .MuiTablePagination-toolbar': {
                  px: 2,
                },
              }}
            />
          </TableContainer>
        </Paper>
      </Box>
    </PageContainer>
  );
};

export default Users;