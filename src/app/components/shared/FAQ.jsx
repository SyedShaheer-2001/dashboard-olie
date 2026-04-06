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
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { CustomizerContext } from '@/app/context/customizerContext';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  const [questionError, setQuestionError] = useState('');
  const [optionsError, setOptionsError] = useState('');

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
      fetchFaqs();
    }
  }, [token]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/content/showFaqs`, {
        headers: { 'x-access-token': token },
      });

      if (res.data.success) {
        setFaqs(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      setFeedback({
        message: 'Failed to fetch FAQs',
        success: false,
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions([
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ]);
    setEditId(null);
    setQuestionError('');
    setOptionsError('');
  };

  const openAddDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (faq) => {
    setQuestion(faq.question || '');
    setOptions(
      faq.Option?.length
        ? faq.Option.map((opt) => ({
            text: opt.text || '',
            isCorrect: !!opt.isCorrect,
          }))
        : [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ]
    );
    setEditId(faq.id);
    setQuestionError('');
    setOptionsError('');
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
    setSubmitting(false);
  };

  const handleOptionTextChange = (index, value) => {
    const updated = [...options];
    updated[index].text = value;
    setOptions(updated);

    if (optionsError) {
      setOptionsError('');
    }
  };

  const handleCorrectChange = (index) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(updated);

    if (optionsError) {
      setOptionsError('');
    }
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { text: '', isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);

    if (optionsError) {
      setOptionsError('');
    }
  };

  const validateForm = () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setQuestionError('Question is required');
      return false;
    }

    if (trimmedQuestion.length < 5) {
      setQuestionError('Question must be at least 5 characters');
      return false;
    }

    setQuestionError('');

    const cleanedOptions = options.map((opt) => ({
      ...opt,
      text: opt.text.trim(),
    }));

    if (cleanedOptions.length < 2) {
      setOptionsError('At least 2 options are required');
      return false;
    }

    const hasEmptyOption = cleanedOptions.some((opt) => !opt.text);
    if (hasEmptyOption) {
      setOptionsError('All options are required');
      return false;
    }

    const uniqueTexts = new Set(cleanedOptions.map((opt) => opt.text.toLowerCase()));
    if (uniqueTexts.size !== cleanedOptions.length) {
      setOptionsError('Options must be unique');
      return false;
    }

    const correctCount = cleanedOptions.filter((opt) => opt.isCorrect).length;
    if (correctCount !== 1) {
      setOptionsError('Select exactly 1 correct option');
      return false;
    }

    setOptionsError('');
    return true;
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      question: question.trim(),
      options: options.map((opt) => ({
        text: opt.text.trim(),
        isCorrect: opt.isCorrect,
      })),
    };

    try {
      setSubmitting(true);

      if (editId) {
        await axios.put(`${BASE_URL}/admin/content/updateFaqs/${editId}`, payload, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });

        setFeedback({
          message: 'Question updated successfully!',
          success: true,
          open: true,
        });
      } else {
        await axios.post(`${BASE_URL}/admin/content/createFaqs`, payload, {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        });

        setFeedback({
          message: 'Question created successfully!',
          success: true,
          open: true,
        });
      }

      closeDialog();
      fetchFaqs();
    } catch (error) {
      console.error('Error saving question:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to save question',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`${BASE_URL}/admin/content/deleteFaqs/${id}`, {
        headers: { 'x-access-token': token },
      });

      fetchFaqs();
      setFeedback({
        message: 'Question deleted successfully!',
        success: true,
        open: true,
      });
    } catch (error) {
      console.error('Failed to delete:', error);
      setFeedback({
        message: error?.response?.data?.message || 'Failed to delete question',
        success: false,
        open: true,
      });
    }
  };

  const filteredFaqs = faqs.filter((faq) =>
    faq.question?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFaqs = filteredFaqs.slice(
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
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: 'auto' }}>
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
              FAQs
            </Typography>
            <Typography variant="body2" sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}>
              Manage FAQ questions and answers.
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
            Add Question
          </Button>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search question..."
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
                <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 140 }}>Options</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Correct Answer</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedFaqs.length > 0 ? (
                paginatedFaqs.map((faq, index) => {
                  const correctOption =
                    faq.Option?.find((opt) => opt.isCorrect)?.text || '-';

                  return (
                    <TableRow key={faq.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{faq.question}</TableCell>
                      <TableCell>{faq.Option?.length || 0}</TableCell>
                      <TableCell>{correctOption}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => openEditDialog(faq)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(faq.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: isDark ? '#cbd5e1' : '#6b7280' }}
                    >
                      {loading ? 'Loading FAQs...' : 'No FAQs found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredFaqs.length}
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

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <form onSubmit={handleCreateOrUpdate}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editId ? 'Edit Question' : 'Add New Question'}
          </DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              autoFocus
              size="small"
              label="Question"
              margin="dense"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (questionError) setQuestionError('');
              }}
              error={!!questionError}
              helperText={questionError || ' '}
            />

            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Options
              </Typography>

              {options.map((option, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                  >
                    <TextField
                      fullWidth
                      size="small"
                      label={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={option.isCorrect}
                          onChange={() => handleCorrectChange(index)}
                        />
                      }
                      label="Correct"
                      sx={{ minWidth: 100, m: 0 }}
                    />

                    {options.length > 2 && (
                      <IconButton
                        color="error"
                        onClick={() => removeOption(index)}
                        size="small"
                      >
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              ))}

              {optionsError && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                  {optionsError}
                </Typography>
              )}

              <Button
                type="button"
                variant="outlined"
                onClick={addOption}
                sx={{ textTransform: 'none', mt: 1 }}
              >
                Add Option
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Select only one correct option.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={closeDialog}
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
              sx={{ textTransform: 'none', boxShadow: 'none' }}
            >
              {submitting
                ? editId
                  ? 'Saving...'
                  : 'Creating...'
                : editId
                ? 'Save Changes'
                : 'Create Question'}
            </Button>
          </DialogActions>
        </form>
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

export default FAQ;