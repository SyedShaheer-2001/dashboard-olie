'use client';
import React, { useEffect, useState, useContext } from 'react';
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
  TableRow,
  TablePagination,
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValue, setFormValue] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      fetchCategories();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/admin/blogRequestCategory/getRequestPostCategory`,
        {
          headers: { 'x-access-token': token },
        }
      );

      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFeedback({
        message: 'Failed to fetch categories',
        success: false,
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateCategory = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Category name is required';
    }

    if (trimmed.length < 2) {
      return 'Category name must be at least 2 characters';
    }

    if (trimmed.length > 50) {
      return 'Category name must be under 50 characters';
    }

    const alreadyExists = categories.some((item) => {
      const sameName = item.name?.trim().toLowerCase() === trimmed.toLowerCase();

      if (selectedCategory?.id) {
        return sameName && item.id !== selectedCategory.id;
      }

      return sameName;
    });

    if (alreadyExists) {
      return 'This category already exists';
    }

    return '';
  };

  const openAddDialog = () => {
    setSelectedCategory(null);
    setFormValue('');
    setFormError('');
    setDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormValue(category.name || '');
    setFormError('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    setFormValue('');
    setFormError('');
    setSubmitting(false);
  };

  const handleFormChange = (e) => {
    const value = e.target.value;
    setFormValue(value);

    if (formError) {
      setFormError(validateCategory(value));
    }
  };

  const handleBlurValidation = () => {
    setFormError(validateCategory(formValue));
  };

  const createCategory = async () => {
    const trimmedValue = formValue.trim();
    const error = validateCategory(trimmedValue);

    if (error) {
      setFormError(error);
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${BASE_URL}/admin/blogRequestCategory/createRequestPostCategory`,
        {
          postRequestCategory: trimmedValue,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      closeDialog();
      fetchCategories();
      setFeedback({
        message: 'Category created successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Create error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to create category',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateCategory = async () => {
    const trimmedValue = formValue.trim();
    const error = validateCategory(trimmedValue);

    if (error) {
      setFormError(error);
      return;
    }

    if (!selectedCategory?.id) return;

    try {
      setSubmitting(true);

      await axios.put(
        `${BASE_URL}/admin/blogRequestCategory/updateRequestPostCategory/${selectedCategory.id}`,
        {
          postRequestCategory: trimmedValue,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      closeDialog();
      fetchCategories();
      setFeedback({
        message: 'Category updated successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Update error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to update category',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(
        `${BASE_URL}/admin/blogRequestCategory/deleteRequestPostCategory/${id}`,
        {
          headers: { 'x-access-token': token },
        }
      );

      fetchCategories();
      setFeedback({
        message: 'Category deleted successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Delete error:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to delete category',
        success: false,
        open: true,
      });
    }
  };

  const handleSubmit = () => {
    if (selectedCategory) {
      updateCategory();
    } else {
      createCategory();
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

  const filteredCategories = categories.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
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
              Post Categories
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
              Manage post categories here.
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
            Add Category
          </Button>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search category..."
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
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openEditDialog(item)}
                        color="primary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteCategory(item.id)}
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
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}
                    >
                      {loading ? 'Loading categories...' : 'No categories found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredCategories.length}
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
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            margin="dense"
            label="Category Name"
            value={formValue}
            onChange={handleFormChange}
            onBlur={handleBlurValidation}
            onKeyDown={handleKeyDown}
            error={!!formError}
            helperText={formError || ' '}
            inputProps={{ maxLength: 50 }}
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
              ? selectedCategory
                ? 'Saving...'
                : 'Adding...'
              : selectedCategory
              ? 'Save Changes'
              : 'Add Category'}
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

export default Categories;