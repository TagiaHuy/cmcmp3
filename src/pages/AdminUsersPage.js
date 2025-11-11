import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, Pagination
} from '@mui/material';
import { getAllUsers } from '../services/userService';

export default function AdminUsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(0); // 0-indexed page
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getAllUsers(page, rowsPerPage, ac.signal); // Pass page and size
        setRows(Array.isArray(data.content) ? data.content : []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } catch (e) {
        if (e.name !== 'AbortError') setErr(e.message || 'Không tải được danh sách user');
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [page, rowsPerPage]); // Re-fetch when page or rowsPerPage changes

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1); // Material-UI Pagination is 1-indexed
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        Danh sách người dùng
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={80}>ID</TableCell>
                  <TableCell>Tên hiển thị</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Quyền</TableCell>
                  <TableCell width={180}>Tạo lúc</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((u) => {
                  const roles = (u.roles ?? u.authorities ?? [])
                    .map((r) => (typeof r === 'string' ? r : r?.name || r?.role || r?.authority || ''))
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <TableRow key={u.id}>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.displayName || u.username || '-'}</TableCell>
                      <TableCell>{u.email || '-'}</TableCell>
                      <TableCell>{u.phone || '-'}</TableCell>
                      <TableCell>{roles || '-'}</TableCell>
                      <TableCell>{u.createdAt?.replace('T', ' ').slice(0, 19) || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page + 1} // Material-UI Pagination is 1-indexed
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
