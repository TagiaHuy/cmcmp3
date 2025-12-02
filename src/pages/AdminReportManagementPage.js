import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Pagination,
  Stack,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import useAdminReports from '../hooks/useAdminReports';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

const DEFAULT_PAGE_SIZE = 10; // khớp với size gửi lên BE

const AdminReportManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotifications();

  const {
    reports,
    loading,
    error,
    approveReport,
    rejectReport,
    page,
    setPage,
    rowsPerPage,
    totalPages,
    totalReports,
  } = useAdminReports();

  const currentPage = typeof page === 'number' ? page : 0; // 0-based
  const pageSize =
    typeof rowsPerPage === 'number' ? rowsPerPage : DEFAULT_PAGE_SIZE;

  const handleApprove = async (reportId) => {
    try {
      await approveReport(reportId);
      notifySuccess('Duyệt báo cáo thành công');
    } catch (err) {
      console.error('Error approving report:', err);
      notifyError('Lỗi khi duyệt báo cáo: ' + err.message);
    }
  };

  const handleReject = async (reportId) => {
    try {
      await rejectReport(reportId);
      notifySuccess('Từ chối báo cáo thành công');
    } catch (err) {
      console.error('Error rejecting report:', err);
      notifyError('Lỗi khi từ chối báo cáo: ' + err.message);
    }
  };

  const handleChangePage = (event, newPage) => {
    // Pagination của MUI là 1-based, hook là 0-based
    setPage(newPage - 1);
  };

  const navigateToContent = (contentType, contentId) => {
    if (!contentId) return;
    if (contentType === 'SONG') navigate(`/songs/${contentId}`);
    if (contentType === 'PLAYLIST') navigate(`/playlists/${contentId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error.message || 'Không tải được danh sách báo cáo.'}
        </Alert>
      </Box>
    );
  }

  const hasData = reports && reports.length > 0;
  const startIndex = hasData ? currentPage * pageSize + 1 : 0;
  const endIndex = hasData ? currentPage * pageSize + reports.length : 0;
  const total = typeof totalReports === 'number' ? totalReports : reports.length;

  // màu tím giống trang danh sách người dùng
  const headerBg = '#4b4d7e';
  const rowOddBg = '#2e3057';
  const rowEvenBg = '#3a3c6a';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#ffffff' }}>
        Quản lý báo cáo
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 3, color: theme.palette.text.secondary }}
      >
        Kiểm duyệt nội dung bị người dùng báo cáo để giữ cho CMC MP3 an toàn.
      </Typography>

      {/* Thanh summary tím giống header */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          px: 3,
          py: 1.5,
          borderRadius: 2,
          bgcolor: headerBg,
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2">
          {hasData
            ? `Hiển thị ${startIndex} – ${endIndex} trên tổng ${total} báo cáo.`
            : 'Hiện không có báo cáo nào.'}
        </Typography>

        {total > 0 && (
          <Chip
            label={`${total} báo cáo đang chờ xử lý`}
            size="small"
            sx={{
              bgcolor: 'rgba(15,23,42,0.2)',
              color: '#E0E7FF',
              borderRadius: 999,
            }}
          />
        )}
      </Paper>

      {hasData ? (
        <>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: '#23253F', // khung ngoài
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: headerBg }}>
                    {[
                      'STT',
                      'Người báo cáo',
                      'Loại báo cáo',
                      'Đối tượng bị báo cáo',
                      'Lý do',
                      'Thời gian',
                      'Trạng thái',
                      'Hành động',
                    ].map((head, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#ffffff',
                          py: 1.5,
                          borderBottom: 'none',
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {reports.map((report, index) => {
                    let chipLabel = 'Unknown';
                    let chipIcon = null;
                    let contentTitle = 'Unknown content';
                    let contentType = null;
                    let contentId = null;

                    switch (report.reportType) {
                      case 'SONG':
                        chipLabel = 'Bài hát';
                        chipIcon = <MusicNoteIcon />;
                        contentType = 'SONG';
                        contentId = report.reportedSong?.id;
                        contentTitle =
                          report.reportedSong?.title || 'Bài hát không tồn tại';
                        break;
                      case 'PLAYLIST':
                        chipLabel = 'Playlist';
                        chipIcon = <PlaylistPlayIcon />;
                        contentType = 'PLAYLIST';
                        contentId = report.reportedPlaylist?.id;
                        contentTitle =
                          report.reportedPlaylist?.title ||
                          'Playlist không tồn tại';
                        break;
                      case 'SONG_COMMENT':
                        chipLabel = 'Bình luận bài hát';
                        chipIcon = <MusicNoteIcon />;
                        contentType = 'SONG';
                        contentId = report.reportedSong?.id;
                        contentTitle = `Bình luận: "${report.reportedSongComment?.content}" của ${report.reportedSongComment?.authorName}`;
                        break;
                      case 'PLAYLIST_COMMENT':
                        chipLabel = 'Bình luận playlist';
                        chipIcon = <PlaylistPlayIcon />;
                        contentType = 'PLAYLIST';
                        contentId = report.reportedPlaylist?.id;
                        contentTitle = `Bình luận: "${report.reportedPlaylistComment?.content}" của ${report.reportedPlaylistComment?.authorName}`;
                        break;
                      default:
                        break;
                    }

                    return (
                      <TableRow
                        key={report.id}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? rowOddBg : rowEvenBg,
                          transition: 'background-color 0.15s ease',
                          '&:hover': {
                            backgroundColor: rowEvenBg, // ✅ hover giống dòng 2–3
                          },
                        }}
                      >
                        {/* STT */}
                        <TableCell
                          sx={{ borderBottom: 'none', color: '#ffffff' }}
                        >
                          {currentPage * pageSize + index + 1}
                        </TableCell>

                        <TableCell
                          sx={{ borderBottom: 'none', color: '#ffffff' }}
                        >
                          {report.reporter?.displayName || 'Unknown user'}
                        </TableCell>

                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip
                            label={chipLabel}
                            icon={chipIcon}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: '#a5b4fc',
                              color: '#e0e7ff',
                              bgcolor: 'rgba(129,140,248,0.2)',
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#c7d2fe',
                              cursor: contentId ? 'pointer' : 'default',
                              '&:hover': contentId
                                ? { textDecoration: 'underline' }
                                : undefined,
                            }}
                            onClick={() =>
                              contentId &&
                              contentType &&
                              navigateToContent(contentType, contentId)
                            }
                          >
                            {contentTitle}
                          </Typography>
                        </TableCell>

                        <TableCell
                          sx={{ borderBottom: 'none', color: '#e5e7eb' }}
                        >
                          {report.reason}
                        </TableCell>

                        <TableCell
                          sx={{ borderBottom: 'none', color: '#e5e7eb' }}
                        >
                          {moment(report.createdAt).fromNow()}
                        </TableCell>

                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip
                            label={report.status}
                            size="small"
                            color={
                              report.status === 'APPROVED'
                                ? 'success'
                                : report.status === 'REJECTED'
                                ? 'error'
                                : 'warning'
                            }
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleApprove(report.id)}
                              startIcon={<CheckCircleIcon />}
                            >
                              Duyệt
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleReject(report.id)}
                              startIcon={<CancelIcon />}
                            >
                              Từ chối
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages || 1}
              page={currentPage + 1}
              onChange={handleChangePage}
              color="primary"
              size="large"
            />
          </Box>
        </>
      ) : (
        <Paper
          sx={{
            mt: 2,
            p: 3,
            borderRadius: 3,
            textAlign: 'center',
            bgcolor: '#23253F',
            color: '#ffffff',
          }}
        >
          <Typography>Hiện không có báo cáo nào.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AdminReportManagementPage;
