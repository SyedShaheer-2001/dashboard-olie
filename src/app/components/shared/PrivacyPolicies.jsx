'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '@/utils/api';

const PrivacyPolicies = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [privacyData, setPrivacyData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', success: true, open: false });

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  // Fetch existing privacy policy on load
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/content/showPrivacyPolicy`, {
          headers: { 'x-access-token': token },
        });
        const policy = res.data?.data;
        if (policy) {
          setPrivacyData(policy);
        }
      } catch (err) {
        console.error('Fetch Policy Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPolicy();
  }, [token]);

  console.log('privacyData', privacyData)

  // Create new privacy policy
  const handleCreate = async () => {
    if (!text.trim()) return;
    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BASE_URL}/admin/content/createPrivacyPolicy`,
        { privacypolicy: text },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy created successfully!', success: true, open: true });
      setPrivacyData(res.data?.data);
      setText('');
    } catch (err) {
      console.error(err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to create policy',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update existing policy
  const handleUpdate = async () => {
    if (!text.trim() || !privacyData?.id) return;
    try {
      setSubmitting(true);
      await axios.put(
        `${BASE_URL}/admin/content/updatePrivacyPolicy/${privacyData.id}`,
        { privacypolicy: text },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy updated successfully!', success: true, open: true });
      setPrivacyData({ ...privacyData, privacyPolicy: text });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setFeedback({
        message: err?.response?.data?.message || 'Failed to update policy',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box mt={5} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box mt={5}>
        <Typography variant="h4" gutterBottom>
          Privacy Policy
        </Typography>

        {/* Display or Edit Mode */}
        {privacyData && !editing ? (
          <>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              {privacyData.privacyPolicy}
            </Typography>
            <Box mt={2}>
              <Button variant="contained" onClick={() => {
                setEditing(true);
                setText(privacyData.privacyPolicy);
              }}>
                Edit
              </Button>
            </Box>
          </>
        ) : (
          <>
            <TextField
              label="Privacy Policy"
              placeholder="Write your privacy policy here..."
              multiline
              minRows={10}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
            />
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={privacyData ? handleUpdate : handleCreate}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : privacyData ? 'Update' : 'Submit'}
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
      >
        <Alert severity={feedback.success ? 'success' : 'error'}>{feedback.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PrivacyPolicies;
