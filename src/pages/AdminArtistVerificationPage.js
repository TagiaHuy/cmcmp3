import React, { useState } from 'react';
import {
  Box, Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, CircularProgress, Alert, Button, Avatar
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import useArtistVerifications from '../hooks/useArtistVerifications';
import { approveArtistVerification, denyArtistVerification } from '../services/verificationService';

export default function AdminArtistVerificationPage() {
  const theme = useTheme();
  const { token } = useAuth();
  const { requests, loading, error, refresh } = useArtistVerifications();
  const [actionLoading, setActionLoading] = useState(null); // To track loading state for each row's action
  const [actionError, setActionError] = useState(null);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setActionError(null);
    try {
      await approveArtistVerification(token, id);
      refresh(); // Refresh the list after action
    } catch (err) {
      setActionError(err.message || 'Failed to approve request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeny = async (id) => {
    setActionLoading(id);
    setActionError(null);
    try {
      await denyArtistVerification(token, id);
      refresh(); // Refresh the list after action
    } catch (err) {
      setActionError(err.message || 'Failed to deny request.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        fontWeight={700} 
        sx={{ mb: 3, color: theme.palette.text.primary }}
      >
        Yêu cầu xác thực nghệ sĩ
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
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
                    {['Người yêu cầu', 'Nghệ danh', 'Ảnh đại diện', 'Hành động'].map((head, i) => (
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
                  {requests.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1">Không có yêu cầu nào đang chờ.</Typography>
                        </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((req, index) => (
                        <TableRow
                          key={req.id}
                          sx={{
                            backgroundColor:
                              index % 2 === 0
                                ? theme.palette.background.table
                                : theme.palette.action.hover,
                          }}
                        >
                          <TableCell>{req.user?.displayName || req.user?.username || 'N/A'}</TableCell>
                          <TableCell>{req.stageName}</TableCell>
                          <TableCell>
                            <Avatar src={req.imageUrl} alt={req.stageName} />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                    variant="contained" 
                                    color="success"
                                    size="small"
                                    disabled={actionLoading === req.id}
                                    onClick={() => handleApprove(req.id)}
                                >
                                    {actionLoading === req.id ? <CircularProgress size={20} /> : 'Duyệt'}
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="error"
                                    size="small"
                                    disabled={actionLoading === req.id}
                                    onClick={() => handleDeny(req.id)}
                                >
                                    {actionLoading === req.id ? <CircularProgress size={20} /> : 'Từ chối'}
                                </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}
