import React from 'react';
import {
    Box, Typography, CircularProgress, Alert, Paper, Stack, Button, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAdminReports from '../hooks/useAdminReports';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

const AdminReportManagementPage = () => {
    const { reports, loading, error, approveReport, rejectReport } = useAdminReports();
    const navigate = useNavigate();

    const handleApprove = async (reportId) => {
        try {
            await approveReport(reportId);
        } catch (err) {
            console.error('Error approving report:', err);
        }
    };

    const handleReject = async (reportId) => {
        try {
            await rejectReport(reportId);
        } catch (err) {
            console.error('Error rejecting report:', err);
        }
    };

    const navigateToContent = (contentType, contentId) => {
        if (contentType === 'SONG') {
            navigate(`/songs/${contentId}`);
        } else if (contentType === 'PLAYLIST') {
            navigate(`/playlists/${contentId}`);
        }
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
                <Alert severity="error">{error.message || 'Could not load pending reports.'}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Manage Content Reports</Typography>

            {reports.length === 0 ? (
                <Typography>No pending reports.</Typography>
            ) : (
                <Stack spacing={3}>
                    {reports.map((report) => {
                        const content = report.song || report.playlist;
                        const contentType = report.reportType; // Assuming 'SONG' or 'PLAYLIST'
                        
                        if (!content) {
                            return (
                                <Paper key={report.id} elevation={2} sx={{ p: 2, backgroundColor: 'grey.900' }}>
                                    <Typography color="error">Reported content not found for report ID: {report.id}</Typography>
                                </Paper>
                            )
                        }

                        return (
                            <Paper key={report.id} elevation={2} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                    <Typography variant="subtitle1" fontWeight="bold">{report.reporter?.displayName || 'Unknown User'}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        reported
                                    </Typography>

                                    {/* Dynamically display content based on reportType */}
                                    {(() => {
                                        let reportedItem = null;
                                        let contentTitle = 'Unknown Content';
                                        let contentTargetId = null;
                                        let contentTargetType = null;
                                        let chipLabel = 'Unknown';
                                        let chipIcon = null;

                                        switch (report.reportType) {
                                            case 'SONG':
                                                reportedItem = report.reportedSong;
                                                contentTitle = reportedItem?.title;
                                                contentTargetId = reportedItem?.id;
                                                contentTargetType = 'SONG';
                                                chipLabel = 'Song';
                                                chipIcon = <MusicNoteIcon />;
                                                break;
                                            case 'PLAYLIST':
                                                reportedItem = report.reportedPlaylist;
                                                contentTitle = reportedItem?.name;
                                                contentTargetId = reportedItem?.id;
                                                contentTargetType = 'PLAYLIST';
                                                chipLabel = 'Playlist';
                                                chipIcon = <PlaylistPlayIcon />;
                                                break;
                                            case 'SONG_COMMENT':
                                                reportedItem = report.reportedSongComment;
                                                contentTitle = `Comment: "${reportedItem?.content}" by ${reportedItem?.authorName}`;
                                                contentTargetId = report.reportedSong?.id; // Navigate to the song
                                                contentTargetType = 'SONG';
                                                chipLabel = 'Song Comment';
                                                chipIcon = <MusicNoteIcon />;
                                                break;
                                            case 'PLAYLIST_COMMENT':
                                                reportedItem = report.reportedPlaylistComment;
                                                contentTitle = `Comment: "${reportedItem?.content}" by ${reportedItem?.authorName}`;
                                                contentTargetId = report.reportedPlaylist?.id; // Navigate to the playlist
                                                contentTargetType = 'PLAYLIST';
                                                chipLabel = 'Playlist Comment';
                                                chipIcon = <PlaylistPlayIcon />;
                                                break;
                                            default:
                                                // Should not happen with valid reportType
                                                break;
                                        }

                                        if (!reportedItem || !contentTargetId) {
                                            return (
                                                <Typography variant="body2" color="error">
                                                    (Content not found or invalid report type)
                                                </Typography>
                                            );
                                        }

                                        return (
                                            <>
                                                <Chip
                                                    label={chipLabel}
                                                    icon={chipIcon}
                                                    size="small"
                                                    color="secondary"
                                                />
                                                <Typography
                                                    variant="subtitle1"
                                                    fontWeight="bold"
                                                    color="primary"
                                                    onClick={() => navigateToContent(contentTargetType, contentTargetId)}
                                                    sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                                >
                                                    {contentTitle}
                                                </Typography>
                                                {/* Display additional info for comments */}
                                                {(report.reportType === 'SONG_COMMENT' || report.reportType === 'PLAYLIST_COMMENT') && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        (ID: {reportedItem.id})
                                                    </Typography>
                                                )}
                                            </>
                                        );
                                    })()}
                                    <Typography variant="caption" color="text.secondary">
                                        ({moment(report.createdAt).fromNow()})
                                    </Typography>
                                </Stack>
                                
                                <Box sx={{ my: 1, p: 2, borderRadius: 1, bgcolor: 'background.default' }}>
                                    <Typography variant="body1"><strong>Reason:</strong> {report.reason}</Typography>
                                </Box>

                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={() => handleApprove(report.id)}
                                    >
                                        Approve Report
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CancelIcon />}
                                        onClick={() => handleReject(report.id)}
                                    >
                                        Reject Report
                                    </Button>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};

export default AdminReportManagementPage;
