
import React from 'react';
import { Box, Container, Grid, Typography, Link } from '@mui/material';
import logo from '../../assets/cmcmp3-logo.png';

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
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <img src={logo} alt="logo" width="120" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#e0e0e0" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2">
              We are a company that specializes in creating awesome web applications.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#e0e0e0" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              123 Main Street, Anytown, USA
            </Typography>
            <Typography variant="body2">
              Email: info@example.com
            </Typography>
            <Typography variant="body2">
              Phone: +1 234 567 8901
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
              Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
