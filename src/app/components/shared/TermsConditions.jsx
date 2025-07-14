'use client';

import React, { useEffect, useState } from 'react';
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
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/react';


// TipTap Menu Bar
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
      <Button onClick={() => editor.chain().focus().toggleBold().run()} variant={editor.isActive('bold') ? 'contained' : 'outlined'} size="small">
        Bold
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant={editor.isActive('italic') ? 'contained' : 'outlined'} size="small">
        Italic
      </Button>
      <Button onClick={() => editor.chain().focus().toggleUnderline().run()} variant={editor.isActive('underline') ? 'contained' : 'outlined'} size="small">
        Underline
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={editor.isActive('heading', { level: 2 }) ? 'contained' : 'outlined'} size="small">
        H2
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant={editor.isActive('heading', { level: 3 }) ? 'contained' : 'outlined'} size="small">
        H3
      </Button>
      <Button onClick={() => editor.chain().focus().setParagraph().run()} variant={editor.isActive('paragraph') ? 'contained' : 'outlined'} size="small">
        Paragraph
      </Button>
    </Box>
  );
};

const TermsConditions = () => {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', success: true, open: false });

  const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
  const token = user?.data?.adminToken;

  // TipTap Editor
  const [editor, setEditor] = useState(null);

useEffect(() => {
  const tiptapEditor = new Editor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'border rounded p-4 min-h-[300px] focus:outline-none bg-white border-black border-2',
      },
    },
  });
  setEditor(tiptapEditor);

  return () => {
    tiptapEditor?.destroy();
  };
}, []);


  // Fetch Privacy Policy
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/content/showTermsAndCondition`, {
          headers: { 'x-access-token': token },
        });
        const policy = res.data?.data;
        if (policy) {
          setPrivacyData(policy);
          editor?.commands.setContent(policy.TermsCondition || '');
        }
      } catch (err) {
        console.error('Fetch Policy Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token && editor) {
      fetchPolicy();
    }
  }, [token, editor]);

  // Create
  const handleCreate = async () => {
    const content = editor?.getHTML() || '';
    if (!content.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BASE_URL}/admin/content/createTermsAndCondition`,
        { termscondition: content },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy created successfully!', success: true, open: true });
      setPrivacyData(res.data?.data);
      editor?.commands.clearContent();
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
    const content = editor?.getHTML() || '';
    if (!content.trim() || !privacyData?.id) return;

    try {
      setSubmitting(true);
      await axios.put(
        `${BASE_URL}/admin/content/updateTermsAndCondition/${privacyData.id}`,
        { termscondition: content },
        {
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
        }
      );
      setFeedback({ message: 'Policy updated successfully!', success: true, open: true });
      setPrivacyData({ ...privacyData, termscondition: content });
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

  if (loading || !editor) {
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
          Terms and conditions
        </Typography>

        {privacyData && !editing ? (
          <>
            <Box
              sx={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f5f5f5',
                padding: 2,
                borderRadius: 1,
              }}
              dangerouslySetInnerHTML={{ __html: privacyData.TermsCondition }}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={() => {
                  setEditing(true);
                  editor?.commands.setContent(privacyData.TermsCondition || '');
                }}
              >
                Edit
              </Button>
            </Box>
          </>
        ) : (
          <>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} sx={{padding:2}} />
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
        <Alert severity={feedback.success ? 'success' : 'error'}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TermsConditions;
