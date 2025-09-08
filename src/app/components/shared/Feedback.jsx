'use client';
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import BASE_URL from '@/utils/api';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TablePagination, TextField, CircularProgress
} from "@mui/material";
import { CustomizerContext } from '@/app/context/customizerContext';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const { activeMode } = useContext(CustomizerContext);
  const backgroundColor = activeMode === "dark" ? "#1e1e2f" : "#ffffff";

  useEffect(() => {
    const USER = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null;
    setToken(USER?.data?.adminToken || null);
  }, []);

  useEffect(() => {
    if (token) {
      fetchFeedbacks();
    }
  }, [token]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/post/userFeedBack`, {
        headers: { "x-access-token": token },
      });
      if (res.data.success) {
        setFeedbacks(res.data.data);
        setFiltered(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch Feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  // handle search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(feedbacks);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        feedbacks.filter(
          (f) =>
            f.message.toLowerCase().includes(lower) ||
            f.email.toLowerCase().includes(lower)
        )
      );
    }
    setPage(0); // reset to first page when searching
  }, [search, feedbacks]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ maxWidth: 950, margin: "auto" }}>
      <h1>User Feedback</h1>

      {/* Search */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search by email or message..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
      />

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            maxWidth: "950px",
            margin: "auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.7)",
            backgroundColor,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell>{fb.email}</TableCell>
                    <TableCell>{fb.message}</TableCell>
                    <TableCell>
                      {new Date(fb.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 50]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
}

export default Feedback;
