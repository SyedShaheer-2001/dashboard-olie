'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import {
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Divider,
  Chip,
  Avatar,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Person, Email, AdminPanelSettings, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import PageContainer from '@/app/components/container/PageContainer';

function Page() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [feedback, setFeedback] = useState({
    message: '',
    success: true,
    open: false,
  });

  useEffect(() => {
    const USER =
      typeof window !== 'undefined'
        ? JSON.parse(sessionStorage.getItem('user'))
        : null;

    setUser(USER?.data || null);
    setToken(USER?.data?.adminToken || null);
    setLoading(false);
  }, []);

  const handlePasswordChange = async () => {
    if (!token) {
      setFeedback({
        message: 'User token not found. Please login again.',
        success: false,
        open: true,
      });
      return;
    }

    if (!currentPassword || !newPassword) {
      setFeedback({
        message: 'Please fill all password fields.',
        success: false,
        open: true,
      });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({
        message: 'New password must be at least 6 characters.',
        success: false,
        open: true,
      });
      return;
    }

    if (!confirm('Are you sure you want to update your password?')) return;

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${BASE_URL}/admin/auth/changePassword`,
        {
          currentpassword: currentPassword,
          newpassword: newPassword,
        },
        {
          headers: { 'x-access-token': token },
        }
      );

      if (res?.data?.success) {
        setCurrentPassword('');
        setNewPassword('');
        setShowPasswordForm(false);
        setFeedback({
          message: 'Password changed successfully!',
          success: true,
          open: true,
        });
      } else {
        setFeedback({
          message: res?.data?.message || 'Failed to change password.',
          success: false,
          open: true,
        });
      }
    } catch (err) {
      console.error(err);
      setFeedback({
        message:
          err?.response?.data?.message || 'Error changing password.',
        success: false,
        open: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Profile" description="User Profile">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Loading profile...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="Profile" description="User Profile">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Please log in
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You need to log in to view your profile.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Profile" description="User Profile">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        minHeight="100%"
        py={4}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 650,
            borderRadius: 4,
            boxShadow: 6,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 3,
              py: 4,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: '#fff',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </Avatar>

              <Box>
                <Typography variant="h4" fontWeight={700}>
                  User Profile
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Manage your account details and password
                </Typography>
              </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {!showPasswordForm ? (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Account Information
                  </Typography>
                  <Divider />
                </Box>

                <Stack spacing={2.2}>
                  <InfoRow
                    icon={<Person fontSize="small" />}
                    label="Name"
                    value={user?.name || 'Admin'}
                  />
                  <InfoRow
                    icon={<Email fontSize="small" />}
                    label="Email"
                    value={user?.email || '-'}
                  />
                  <InfoRow
                    icon={<AdminPanelSettings fontSize="small" />}
                    label="Role"
                    value={
                      <Chip
                        label={user?.userType || 'ADMIN'}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    }
                  />
                </Stack>

                <Box pt={1}>
                  <Button
                    variant="contained"
                    startIcon={<Lock />}
                    onClick={() => setShowPasswordForm(true)}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    Change Password
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enter your current password and your new password below.
                  </Typography>
                </Box>

                <Divider />

                <TextField
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    onClick={handlePasswordChange}
                    disabled={submitting}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {submitting ? 'Updating...' : 'Submit'}
                  </Button>

                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                    }}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={feedback.success ? 'success' : 'error'}
          variant="filled"
          onClose={() => setFeedback({ ...feedback, open: false })}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'primary.light',
            color: 'primary.main',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="subtitle2" fontWeight={700}>
            {typeof value === 'string' ? value : ''}
          </Typography>
        </Box>
      </Stack>

      {typeof value !== 'string' ? value : null}
    </Box>
  );
}

export default Page;