import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, Pagination, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getUnapprovedSongs, approveSong, rejectSong } from '../services/songService';

export default function AdminSongModerationPage() {
  const theme = useTheme();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUnapprovedSongs = async () => {
    const ac = new AbortController();
    try {
      setLoading(true);
      setErr(null);
      const data = await getUnapprovedSongs(page, rowsPerPage, ac.signal);
      setRows(Array.isArray(data.content) ? data.content : []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      if (e.name !== 'AbortError') setErr(e.message || 'Không tải được danh sách bài hát');
    } finally {
      setLoading(false);
    }
    return () => ac.abort();
  };

  useEffect(() => {
    fetchUnapprovedSongs();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleApprove = async (songId) => {
    try {
      await approveSong(songId);
      // Refresh the list after approval
      fetchUnapprovedSongs();
    } catch (error) {
      setErr('Lỗi khi phê duyệt bài hát: ' + error.message);
    }
  };

  const handleReject = async (songId) => {
    try {
      await rejectSong(songId);
      // Refresh the list after rejection
      fetchUnapprovedSongs();
    } catch (error) {
      setErr('Lỗi khi từ chối bài hát: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        fontWeight={700} 
        sx={{ mb: 3, color: theme.palette.text.primary }}
      >
        Kiểm duyệt bài hát
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
                    {['STT', 'Ảnh', 'Tên bài hát', 'Nghệ sĩ', 'Tags', 'Nghe thử', 'Hành động'].map((head, i) => (
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
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                        <TableCell>
                            {s.imageUrl && <img src={s.imageUrl} alt={s.title} style={{ width: 50, height: 50, borderRadius: 5 }} />}
                        </TableCell>
                        <TableCell>{s.title || '-'}</TableCell>
                        <TableCell>{s.artists || '-'}</TableCell>
                        <TableCell>{s.tags || '-'}</TableCell>
                        <TableCell>
                            {s.mediaSrc && <audio controls src={s.mediaSrc} style={{ width: '150px' }} />}
                        </TableCell>
                        <TableCell>
                          <Button variant="contained" color="success" sx={{ mr: 1 }} onClick={() => handleApprove(s.id)}>Duyệt</Button>
                          <Button variant="contained" color="error" onClick={() => handleReject(s.id)}>Từ chối</Button>
                        </TableCell>
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
