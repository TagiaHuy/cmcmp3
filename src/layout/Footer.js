
import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, Stack } from '@mui/material';
import logo from '../assets/cmcmp3-logo.png';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.footer.background,
        p: 6,
        color: (theme) => theme.footer.textColor,
        fontSize: (theme) => theme.footer.fontSize,
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Divider sx={{ backgroundColor: (theme) => theme.Button.divider, margin: '8px 0' }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={1.2}>
              <img src={logo} alt="CMC MP3" width="140" style={{ opacity: 0.9 }} />
              <Typography variant="body2" color="text.secondary">
                Nghe nhạc mọi lúc, lưu trữ và quản lý thư viện cá nhân của bạn một cách đơn giản.
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color={(theme) => theme.footer.h6TextColor} gutterBottom>
              Về CMC MP3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Nền tảng phát nhạc với trải nghiệm trực quan, đề xuất thông minh và kho nhạc phong phú.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color={(theme) => theme.footer.h6TextColor} gutterBottom>
              Liên hệ
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@cmcmp3.vn
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hotline: 0123 456 789
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Giờ hỗ trợ: 8:00 - 22:00 (T2 - CN)
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center" color="text.secondary">
            © {new Date().getFullYear()} CMC MP3. Mọi quyền được bảo lưu.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
