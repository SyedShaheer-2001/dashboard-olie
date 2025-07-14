'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import * as dropdownData from './data';

import { IconMail } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import Image from 'next/image';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import axios from 'axios';
import BASE_URL from '@/utils/api';
import { CircularProgress } from '@mui/material';



const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const user = JSON.parse(sessionStorage.getItem('user'));
console.log("user", user)
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage]= useState()

  const token = user?.data?.adminToken; 
  const myImage = typeof window !== 'undefined' ? localStorage.getItem('myImage') : null;
  console.log('myImage', myImage)

  
  

  const handleUploadClick = () => setDialogOpen(true);
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage || !token) return;

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      setUploading(true);
      const res = await axios.post(
        `${BASE_URL}/admin/auth/editImage`,
        formData,
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload success:', res.data);
      setImage(res.data.data.image)
      localStorage.setItem('myImage', res.data.data.image);
      handleDialogClose();
      // Optionally refresh user info or image
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };
  console.log('image coming' ,image)

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src= {myImage}
          alt={'ProfileImg'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 4,
          },
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
        <Avatar src={ myImage } alt={"ProfileImg"} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {user?.data?.name || "Joe Wilson"} 
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {user?.data?.userType}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <IconMail width={15} height={15} />
              {user?.data?.email}
            </Typography>
          </Box>
        </Stack>
        <Box textAlign="center" mb={2}>
          <Button variant="contained" onClick={handleUploadClick}>
            Change Photo
          </Button>
        </Box>
        <Divider />
        {dropdownData.profile.map((profile) => (
          <Box key={profile.title}>
            <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
              <Link href={profile.href}>
                <Stack direction="row" spacing={2}>
                  <Box
                    width="45px"
                    height="45px"
                    bgcolor="primary.light"
                    display="flex"
                    alignItems="center"
                    justifyContent="center" flexShrink="0"
                  >
                    <Avatar
                      src={profile.icon}
                      alt={profile.icon}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 0,
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="textPrimary"
                      className="text-hover"
                      noWrap
                      sx={{
                        width: '240px',
                      }}
                    >
                      {profile.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: '240px',
                      }}
                      noWrap
                    >
                      {profile.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Link>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          
          <Button href="/auth/auth1/login" variant="outlined" color="primary" component={Link} fullWidth 
          onClick={() => {
    sessionStorage.removeItem('user'); 
  }}>
            Logout
          </Button>
        </Box>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Upload Profile Image</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={uploading || !selectedImage}>
            {uploading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    
      
    </Box>

    
  );
};

export default Profile;
