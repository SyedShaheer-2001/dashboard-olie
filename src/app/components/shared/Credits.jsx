'use client';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { CustomizerContext } from '@/app/context/customizerContext';

const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [creditValue, setCreditValue] = useState('');
  const [amountValue, setAmountValue] = useState('');
  const [errors, setErrors] = useState({
    credit: '',
    amount: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [feedback, setFeedback] = useState({
    message: '',
    success: true,
    open: false,
  });

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
    if (token) {
      fetchCredits();
    }
  }, [token]);

  const fetchCredits = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/admin/credit/showCredit`, {
        headers: { 'x-access-token': token },
      });

      if (res.data.success) {
        setCredits(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFeedback({
        message: 'Failed to fetch credits',
        success: false,
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (credit, amount) => {
    const nextErrors = {
      credit: '',
      amount: '',
    };

    const trimmedCredit = credit.trim();
    const trimmedAmount = amount.toString().trim();

    if (!trimmedCredit) {
      nextErrors.credit = 'Credit name is required';
    } else if (trimmedCredit.length < 2) {
      nextErrors.credit = 'Credit name must be at least 2 characters';
    } else if (trimmedCredit.length > 50) {
      nextErrors.credit = 'Credit name must be under 50 characters';
    }

    const alreadyExists = credits.some((item) => {
      const sameName = item.credit?.trim().toLowerCase() === trimmedCredit.toLowerCase();

      if (selectedCredit?.id) {
        return sameName && item.id !== selectedCredit.id;
      }

      return sameName;
    });

    if (!nextErrors.credit && alreadyExists) {
      nextErrors.credit = 'This credit already exists';
    }

    if (!trimmedAmount) {
      nextErrors.amount = 'Amount is required';
    } else if (Number.isNaN(Number(trimmedAmount))) {
      nextErrors.amount = 'Amount must be a valid number';
    } else if (Number(trimmedAmount) < 0) {
      nextErrors.amount = 'Amount cannot be negative';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const resetForm = () => {
    setSelectedCredit(null);
    setCreditValue('');
    setAmountValue('');
    setErrors({
      credit: '',
      amount: '',
    });
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setSelectedCredit(item);
    setCreditValue(item.credit || '');
    setAmountValue(item.amount?.toString() || '');
    setErrors({
      credit: '',
      amount: '',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSubmitting(false);
    resetForm();
  };

  const handleCreditChange = (value) => {
    setCreditValue(value);
    if (errors.credit) {
      setErrors((prev) => ({
        ...prev,
        credit: '',
      }));
    }
  };

  const handleAmountChange = (value) => {
    setAmountValue(value);
    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: '',
      }));
    }
  };

  const createCredit = async () => {
    if (!validateForm(creditValue, amountValue)) return;

    try {
      setSubmitting(true);

      await axios.post(
        `${BASE_URL}/admin/credit/createCredit`,
        {
          credit: creditValue.trim(),
          amount: parseFloat(amountValue),
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      closeDialog();
      fetchCredits();
      setFeedback({
        message: 'Credit created successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Create error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to create credit',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateCredit = async () => {
    if (!selectedCredit?.id) return;
    if (!validateForm(creditValue, amountValue)) return;

    try {
      setSubmitting(true);

      await axios.put(
        `${BASE_URL}/admin/credit/updateCredit/${selectedCredit.id}`,
        {
          credit: creditValue.trim(),
          amount: parseFloat(amountValue),
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      closeDialog();
      fetchCredits();
      setFeedback({
        message: 'Credit updated successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Update error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to update credit',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCredit = async (id) => {
    if (!confirm('Are you sure you want to delete this credit?')) return;

    try {
      await axios.delete(`${BASE_URL}/admin/credit/deleteCredit/${id}`, {
        headers: { 'x-access-token': token },
      });

      fetchCredits();
      setFeedback({
        message: 'Credit deleted successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Delete error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to delete credit',
        success: false,
        open: true,
      });
    }
  };

  const handleSubmit = () => {
    if (selectedCredit) {
      updateCredit();
    } else {
      createCredit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCredits = credits.filter((item) =>
    item.credit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCredits = filteredCredits.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
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
              Credits
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
              Manage credit plans and amounts here.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddDialog}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: 'none',
            }}
          >
            Add Credit
          </Button>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search credit..."
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
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: isDark ? '#25253a' : '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, width: 90 }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Credit</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCredits.length > 0 ? (
                paginatedCredits.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.credit}</TableCell>
                    <TableCell>${Number(item.amount || 0).toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditDialog(item)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteCredit(item.id)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}
                    >
                      {loading ? 'Loading credits...' : 'No credits found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredCredits.length}
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

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {selectedCredit ? 'Edit Credit' : 'Add New Credit'}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="dense"
            label="Credit Name"
            value={creditValue}
            onChange={(e) => handleCreditChange(e.target.value)}
            onKeyDown={handleKeyDown}
            error={!!errors.credit}
            helperText={errors.credit || ' '}
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            fullWidth
            size="small"
            margin="dense"
            label="Amount"
            type="number"
            value={amountValue}
            onChange={(e) => handleAmountChange(e.target.value)}
            onKeyDown={handleKeyDown}
            error={!!errors.amount}
            helperText={errors.amount || ' '}
            inputProps={{ min: 0, step: '0.01' }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={closeDialog}
            color="inherit"
            sx={{ textTransform: 'none' }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ textTransform: 'none', boxShadow: 'none' }}
          >
            {submitting
              ? selectedCredit
                ? 'Saving...'
                : 'Adding...'
              : selectedCredit
              ? 'Save Changes'
              : 'Add Credit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.success ? 'success' : 'error'}
          variant="filled"
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Credits;