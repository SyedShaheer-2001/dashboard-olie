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
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomizerContext } from '@/app/context/customizerContext';

const initialForm = {
  eventName: '',
  eventDescription: '',
  eventDate: '',
  eventTime: '',
  eventAddress: '',
  eventStates: '',
  eventCity: '',
  eventCountry: '',
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [viewEvent, setViewEvent] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [errors, setErrors] = useState({
    eventName: '',
    eventDescription: '',
    eventDate: '',
    eventTime: '',
    eventAddress: '',
    eventStates: '',
    eventCity: '',
    eventCountry: '',
    image: '',
  });

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
      fetchEvents();
    }
  }, [token]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/admin/event/showAllEvents`, {
        headers: { 'x-access-token': token },
      });

      if (res.data.success) {
        setEvents(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setFeedback({
        message: 'Failed to fetch events',
        success: false,
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearImagePreview = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const resetForm = () => {
    clearImagePreview();
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview('');
    setCurrentEvent(null);
    setErrors({
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventTime: '',
      eventAddress: '',
      eventStates: '',
      eventCity: '',
      eventCountry: '',
      image: '',
    });
  };

  const getDateInputValue = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 10);
  };

  const getTimeInputValue = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(11, 16);
  };

  const openCreateDialog = () => {
    resetForm();
    setFormMode('create');
    setFormDialogOpen(true);
  };

  const openEditDialog = (event) => {
    resetForm();
    setFormMode('edit');
    setCurrentEvent(event);

    setFormData({
      eventName: event.eventName || '',
      eventDescription: event.eventDescription || '',
      eventDate: getDateInputValue(event.eventDateAndTime),
      eventTime: getTimeInputValue(event.eventDateAndTime),
      eventAddress: event.eventAddress || '',
      eventStates: event.eventStates || '',
      eventCity: event.eventCity || '',
      eventCountry: event.eventCountry || '',
    });

    setImagePreview(event.image || '');
    setFormDialogOpen(true);
  };

  const closeFormDialog = () => {
    setFormDialogOpen(false);
    setSubmitting(false);
    resetForm();
  };

  const openViewDialog = (event) => {
    setViewEvent(event);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewEvent(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setImageFile(null);

      if (formMode === 'create') {
        clearImagePreview();
        setImagePreview('');
      }
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please select a valid image file',
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image must be under 5MB',
      }));
      return;
    }

    clearImagePreview();
    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(previewUrl);
    setErrors((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const validateForm = () => {
    const nextErrors = {
      eventName: '',
      eventDescription: '',
      eventDate: '',
      eventTime: '',
      eventAddress: '',
      eventStates: '',
      eventCity: '',
      eventCountry: '',
      image: '',
    };

    if (!formData.eventName.trim()) {
      nextErrors.eventName = 'Event name is required';
    } else if (formData.eventName.trim().length < 3) {
      nextErrors.eventName = 'Event name must be at least 3 characters';
    }

    if (!formData.eventDescription.trim()) {
      nextErrors.eventDescription = 'Description is required';
    } else if (formData.eventDescription.trim().length < 10) {
      nextErrors.eventDescription = 'Description must be at least 10 characters';
    }

    if (!formData.eventDate) {
      nextErrors.eventDate = 'Date is required';
    }

    if (!formData.eventTime) {
      nextErrors.eventTime = 'Time is required';
    }

    if (!formData.eventAddress.trim()) {
      nextErrors.eventAddress = 'Address is required';
    }

    if (!formData.eventStates.trim()) {
      nextErrors.eventStates = 'State is required';
    }

    if (!formData.eventCity.trim()) {
      nextErrors.eventCity = 'City is required';
    }

    if (!formData.eventCountry.trim()) {
      nextErrors.eventCountry = 'Country is required';
    }

    if (formMode === 'create' && !imageFile) {
      nextErrors.image = 'Image is required';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const buildFormData = () => {
    const payload = new FormData();

    payload.append('eventName', formData.eventName.trim());
    payload.append('eventDescription', formData.eventDescription.trim());

    const isoDateTime = new Date(
      `${formData.eventDate}T${formData.eventTime}`
    ).toISOString();

    payload.append('eventDateAndTime', isoDateTime);
    payload.append('eventAddress', formData.eventAddress.trim());
    payload.append('eventStates', formData.eventStates.trim());
    payload.append('eventCity', formData.eventCity.trim());
    payload.append('eventCountry', formData.eventCountry.trim());

    if (imageFile) {
      payload.append('image', imageFile);
    }

    return payload;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await axios.post(`${BASE_URL}/admin/event/createEvent`, buildFormData(), {
        headers: {
          'x-access-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      closeFormDialog();
      fetchEvents();
      setFeedback({
        message: 'Event created successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to create event',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!currentEvent?.id) return;

    try {
      setSubmitting(true);

      await axios.put(
        `${BASE_URL}/admin/event/updateEvent/${currentEvent.id}`,
        buildFormData(),
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      closeFormDialog();
      fetchEvents();
      setFeedback({
        message: 'Event updated successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to update event',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`${BASE_URL}/admin/event/deleteEvent/${id}`, {
        headers: { 'x-access-token': token },
      });

      fetchEvents();
      setFeedback({
        message: 'Event deleted successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Delete failed:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to delete event',
        success: false,
        open: true,
      });
    }
  };

  const filteredEvents = events.filter((event) => {
    const keyword = searchTerm.toLowerCase();

    return (
      event.eventName?.toLowerCase().includes(keyword) ||
      event.eventCity?.toLowerCase().includes(keyword) ||
      event.eventCountry?.toLowerCase().includes(keyword) ||
      event.eventStates?.toLowerCase().includes(keyword) ||
      event.eventAddress?.toLowerCase().includes(keyword)
    );
  });

  const paginatedEvents = filteredEvents.slice(
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

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-US');
  };

  const formatTime = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1150, mx: 'auto' }}>
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
              Events
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
              Manage events, schedules, location, and images.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: 'none',
            }}
          >
            Add Event
          </Button>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, city, country, state, or address..."
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
                <TableCell sx={{ fontWeight: 700, width: 80 }}>S.No</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 110 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>City</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Country</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : paginatedEvents.length > 0 ? (
                paginatedEvents.map((event, index) => (
                  <TableRow key={event.id} hover>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{event.eventName || '-'}</TableCell>
                    <TableCell>
                      {event.image ? (
                        <Box
                          component="img"
                          src={event.image}
                          alt={event.eventName}
                          sx={{
                            width: 72,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                          }}
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{formatDate(event.eventDateAndTime)}</TableCell>
                    <TableCell>{formatTime(event.eventDateAndTime)}</TableCell>
                    <TableCell>{event.eventCity || '-'}</TableCell>
                    <TableCell>{event.eventCountry || '-'}</TableCell>
                    <TableCell>
                      {event.eventStates}, {event.eventAddress}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => openViewDialog(event)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => openEditDialog(event)}
                        color="secondary"
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteEvent(event.id)}
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
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}
                    >
                      No events found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredEvents.length}
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

      <Dialog open={formDialogOpen} onClose={closeFormDialog} fullWidth maxWidth="sm">
        <form onSubmit={formMode === 'create' ? handleCreateEvent : handleUpdateEvent}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {formMode === 'create' ? 'Add Event' : 'Edit Event'}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              size="small"
              label="Event Name"
              margin="dense"
              value={formData.eventName}
              onChange={(e) => handleInputChange('eventName', e.target.value)}
              error={!!errors.eventName}
              helperText={errors.eventName || ' '}
            />

            <TextField
              fullWidth
              size="small"
              multiline
              minRows={4}
              label="Description"
              margin="dense"
              value={formData.eventDescription}
              onChange={(e) => handleInputChange('eventDescription', e.target.value)}
              error={!!errors.eventDescription}
              helperText={errors.eventDescription || ' '}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Date"
                margin="dense"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                error={!!errors.eventDate}
                helperText={errors.eventDate || ' '}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                size="small"
                type="time"
                label="Time"
                margin="dense"
                value={formData.eventTime}
                onChange={(e) => handleInputChange('eventTime', e.target.value)}
                error={!!errors.eventTime}
                helperText={errors.eventTime || ' '}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              fullWidth
              size="small"
              label="Address"
              margin="dense"
              value={formData.eventAddress}
              onChange={(e) => handleInputChange('eventAddress', e.target.value)}
              error={!!errors.eventAddress}
              helperText={errors.eventAddress || ' '}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                size="small"
                label="State"
                margin="dense"
                value={formData.eventStates}
                onChange={(e) => handleInputChange('eventStates', e.target.value)}
                error={!!errors.eventStates}
                helperText={errors.eventStates || ' '}
              />

              <TextField
                fullWidth
                size="small"
                label="City"
                margin="dense"
                value={formData.eventCity}
                onChange={(e) => handleInputChange('eventCity', e.target.value)}
                error={!!errors.eventCity}
                helperText={errors.eventCity || ' '}
              />
            </Stack>

            <TextField
              fullWidth
              size="small"
              label="Country"
              margin="dense"
              value={formData.eventCountry}
              onChange={(e) => handleInputChange('eventCountry', e.target.value)}
              error={!!errors.eventCountry}
              helperText={errors.eventCountry || ' '}
            />

            <Box sx={{ mt: 1 }}>
              <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                {formMode === 'create' ? 'Upload Image' : 'Change Image'}
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </Button>

              {errors.image && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  {errors.image}
                </Typography>
              )}

              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Preview"
                  sx={{
                    mt: 2,
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'cover',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb',
                  }}
                />
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={closeFormDialog}
              color="inherit"
              disabled={submitting}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ textTransform: 'none', boxShadow: 'none', minWidth: 130 }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : formMode === 'create' ? (
                'Add Event'
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={closeViewDialog} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: 700 }}>{viewEvent?.eventName}</DialogTitle>

        <DialogContent>
          {viewEvent?.image && (
            <Box
              component="img"
              src={viewEvent.image}
              alt={viewEvent.eventName}
              sx={{
                width: '100%',
                maxHeight: 320,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 2,
              }}
            />
          )}

          <Stack
            direction="row"
            spacing={1}
            sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}
          >
            <Typography variant="body2">
              <strong>Date:</strong> {formatDate(viewEvent?.eventDateAndTime)}
            </Typography>
            <Typography variant="body2">
              <strong>Time:</strong> {formatTime(viewEvent?.eventDateAndTime)}
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {viewEvent?.eventDescription}
          </Typography>

          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Country:</strong> {viewEvent?.eventCountry || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>State:</strong> {viewEvent?.eventStates || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>City:</strong> {viewEvent?.eventCity || '-'}
            </Typography>
            <Typography variant="body2">
              <strong>Address:</strong> {viewEvent?.eventAddress || '-'}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeViewDialog} sx={{ textTransform: 'none' }}>
            Close
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

export default Events;