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
  IconButton,
  Alert,
  CircularProgress,
  Link,
  Divider,
  Fade
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email || !password) {
      setErrorMsg('Please fill out all mandatory fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'Customer'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setLoading(false);
        setRegistered(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        setErrorMsg('Could not connect to backend server. Please verify backend is running on http://localhost:5000');
      } else {
        setErrorMsg(err.message);
      }
    }
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
          {registered ? (
            <Fade in={registered}>
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
                  Registration Complete!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Redirecting you to the sign-in portal...
                </Typography>
              </Box>
            </Fade>
          ) : (
            <>
              {/* Header */}
              <Box textAlign="center">
                <Typography variant="h5" component="h1" fontWeight="700" color="text.primary" sx={{ fontFamily: 'Playfair Display, serif' }}>
                  Create Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                  Join Aurum to reserve appointments and purchase items.
                </Typography>
              </Box>

              {/* Alert Error Box */}
              {errorMsg && (
                <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ borderRadius: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              {/* Form */}
              <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Full Name"
                  type="text"
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Email Address"
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

                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
                </Button>
              </Box>

              <Divider />

              {/* Footer */}
              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have a profile?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    fontWeight="700"
                    color="primary.main"
                    underline="hover"
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Register;
