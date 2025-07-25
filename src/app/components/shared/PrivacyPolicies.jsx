'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import ConfirmDialog from '../ConfirmDialog';

const PrivacyPolicies = () => {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', success: true, open: false });
  const [content, setContent] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  


  const [user , setUser] = useState();
    useEffect(() => {
      const USER = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
      setUser(USER);
    }, []);
  const token = user?.data?.adminToken;

  // Fetch Privacy Policy
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/admin/content/showPrivacyPolicy`, {
          headers: { 'x-access-token': token },
        });
        const policy = res.data?.data;
        if (policy) {
          setPrivacyData(policy);
          setContent(policy.privacyPolicy || '');
        }
      } catch (err) {
        console.error('Fetch Policy Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPolicy();
  }, [token]);

  // Create
  const handleCreate = async () => {
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BASE_URL}/admin/content/createPrivacyPolicy`,
        { privacypolicy: content },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy created successfully!', success: true, open: true });
      setPrivacyData(res.data?.data);
      setContent('');
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

  // Update
  const handleUpdate = async () => {
    if (!content.trim() || !privacyData?.id) return;

    try {
      setSubmitting(true);
      await axios.put(
        `${BASE_URL}/admin/content/updatePrivacyPolicy/${privacyData.id}`,
        { privacypolicy: content },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy updated successfully!', success: true, open: true });
      setPrivacyData({ ...privacyData, privacyPolicy: content });
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

  const  handleform = () => {
    setConfirmOpen(true)
  }

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
        {privacyData && !editing ? (
          <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1>Privacy Policy</h1>
            
         
          <Box mt={2}>
            <Button
              variant="contained"
              onClick={() => {
                setEditing(true);
                setContent(privacyData.privacyPolicy || '');
              }}
            >
              Edit
            </Button>
          </Box>

        </div>
            <Box
              sx={{
                whiteSpace: 'pre-wrap',
                padding: 2,
                borderRadius: 2,
             border: '1px solid #c5bdbdff',
             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
              }}
              dangerouslySetInnerHTML={{ __html: privacyData.privacyPolicy }}
            />

          </>
        ) : (
          <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1>Privacy Policy</h1>
            
         <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={privacyData ? handleform : handleCreate}
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : privacyData ? 'Update' : 'Submit'}
              </Button>
            </Box>

        </div>
            <ReactQuill
              value={content}
              onChange={setContent}
              theme="snow"
              style={{  minHeight: '300px', marginBottom: '16px' }}
            />
            
          </>
        )}
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={feedback.success ? 'success' : 'error'}>
          {feedback.message}
        </Alert>
      </Snackbar>
      <ConfirmDialog
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={handleUpdate}
              title="Update Privacy Policy?"
              message="Are you sure you want to update the Privacy Policy?"
            />
    </Container>
  );
};

export default PrivacyPolicies;
