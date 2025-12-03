import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Stack
} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CreateReportModal = ({ open, onClose, onSubmit }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(reason);
            setReason(''); // Reset reason after submit
        }
    };

    const handleClose = () => {
        setReason(''); // Also reset on close
        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-report-modal-title"
        >
            <Box sx={style}>
                <Typography id="create-report-modal-title" variant="h6" component="h2">
                    Báo cáo nội dung
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    margin="normal"
                    label="Lý do báo cáo"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Vui lòng mô tả lý do bạn cho rằng nội dung này vi phạm..."
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }} justifyContent="flex-end">
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!reason.trim()}>
                        Gửi báo cáo
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CreateReportModal;
