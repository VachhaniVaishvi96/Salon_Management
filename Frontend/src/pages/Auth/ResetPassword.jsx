import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Link,
  Divider,
  Fade
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please enter your profile email address.');
      return;
    }

    setSent(true);
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        flexGrow: 1,
        minHeight: 'calc(100vh - 70px)',
        backgroundImage: 'radial-gradient(circle at center, rgba(241, 245, 249, 0.5) 0%, rgba(226, 232, 240, 0.8) 70%)',
      }}
    >
      <Card
        elevation={4}
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 4,
          p: { xs: 1, sm: 2 },
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {sent ? (
            <Fade in={sent}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 4,
                  gap: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
                <Typography variant="h5" fontWeight="700" color="text.primary" sx={{ fontFamily: 'Playfair Display, serif' }}>
                  Recovery Email Sent!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check your inbox for reset instructions. Redirecting you to login...
                </Typography>
              </Box>
            </Fade>
          ) : (
            <>
              {/* Header */}
              <Box textAlign="center">
                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary" sx={{ fontFamily: 'Playfair Display, serif' }}>
                  Reset Password
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                  Enter your profile email and we will send you a password recovery link.
                </Typography>
              </Box>

              {/* Alert Error Box */}
              {errorMsg && (
                <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleReset} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Profile Email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  Send Recovery Link
                </Button>
              </Box>

              <Divider />

              {/* Footer */}
              <Box textAlign="center">
                <Link
                  component={RouterLink}
                  to="/login"
                  fontWeight="700"
                  color="primary.main"
                  underline="hover"
                  variant="body2"
                >
                  Back to Sign In
                </Link>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default ResetPassword;
