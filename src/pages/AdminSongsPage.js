import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, Pagination
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getSongsByUserId } from '../services/songService';
import { useAuth } from '../context/AuthContext';

export default function AdminSongsPage() {
  const theme = useTheme();
  const { user: currentUser } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    if (!currentUser || !currentUser.id) {
        setErr("User not found");
        setLoading(false);
        return;
    }
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const data = await getSongsByUserId(currentUser.id, page, rowsPerPage, ac.signal);
        setRows(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages || 0);
      } catch (e) {
        if (e.name !== 'AbortError') setErr(e.message || 'Không tải được danh sách bài hát');
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [page, rowsPerPage, currentUser]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        fontWeight={700} 
        sx={{ mb: 3, color: theme.palette.text.primary }}
      >
        Danh sách bài hát
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : (
        <>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              backgroundColor: theme.palette.background.table,
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                    {['STT', 'Tên bài hát', 'Nghệ sĩ', 'Tags', 'Lượt nghe', 'Lượt thích', 'Ngày tạo'].map((head, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: theme.palette.text.primary,
                          py: 2
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((s, index) => {
                    return (
                      <TableRow
                        key={s.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0
                              ? theme.palette.background.table
                              : theme.palette.action.hover,
                          '&:hover': {
                            backgroundColor: theme.palette.action.selected,
                            cursor: 'pointer',
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{s.title || '-'}</TableCell>
                        <TableCell>{s.artists || '-'}</TableCell>
                        <TableCell>{s.tags || '-'}</TableCell>
                        <TableCell>{s.listenCount || 0}</TableCell>
                        <TableCell>{s.likeCount || 0}</TableCell>
                        <TableCell>{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handleChangePage}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 600,
                }
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
