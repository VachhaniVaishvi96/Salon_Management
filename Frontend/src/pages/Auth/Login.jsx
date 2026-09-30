import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  Paper,
  Divider,
  Stack
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { loginSuccess } from '../../store/authSlice';

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch(loginSuccess({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          token: data.token
        }));
        setLoading(false);
        navigate(`/dashboard/${data.user.role.toLowerCase()}`);
      } else {
        throw new Error(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoading(false);
      if (err.message === 'Failed to fetch' || err.message.includes('fetch')) {
        setErrorMsg('Could not connect to the backend server. Please verify your backend is running on http://localhost:5000');
      } else {
        setErrorMsg(err.message);
      }
    }
  };

  const handleQuickFill = (fillEmail, fillPassword) => {
    setEmail(fillEmail);
    setPassword(fillPassword);
    setErrorMsg('');
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
          {/* Header */}
          <Box textAling="center" textAlign="center">
            <Typography variant="h5" component="h1" fontWeight="700" color="text.primary" sx={{ fontFamily: 'Playfair Display, serif' }}>
              Aurum Portal
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
              Sign in to manage your bookings and retail catalog.
            </Typography>
          </Box>

          {/* Alert Error Box */}
          {errorMsg && (
            <Alert severity="error" onClose={() => setErrorMsg('')} sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" fontWeight="600" color="text.secondary" textTransform="uppercase">
                  Password
                </Typography>
                <Link
                  component={RouterLink}
                  to="/reset-password"
                  variant="caption"
                  fontWeight="700"
                  color="primary.main"
                  underline="hover"
                >
                  Forgot Password?
                </Link>
              </Box>
              <TextField
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
            </Box>

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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In To Account'}
            </Button>
          </Box>

          {/* Seed Credentials Quick Click Box */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: 'grey.50',
              borderColor: 'grey.200',
              borderStyle: 'dashed',
            }}
          >
            <Typography variant="caption" fontWeight="700" color="primary.main" display="block" gutterBottom>
              MongoDB Seed Credentials (Click to Auto-fill):
            </Typography>
            <Stack spacing={0.8} sx={{ mt: 1 }}>
              {[
                { role: 'Admin', email: 'admin@salon.com', pass: 'admin123' },
                { role: 'Barber', email: 'marcus@salon.com', pass: 'barber123' },
                { role: 'Receptionist', email: 'emily@salon.com', pass: 'recep123' },
                { role: 'Customer', email: 'alex@example.com', pass: 'customer123' },
              ].map((item) => (
                <Box
                  key={item.role}
                  onClick={() => handleQuickFill(item.email, item.pass)}
                  sx={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 0.5,
                    px: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'primary.50' },
                  }}
                >
                  <Typography variant="caption" fontWeight="600" color="text.primary">
                    {item.role}: <code>{item.email}</code>
                  </Typography>
                  <ContentCopyIcon fontSize="inherit" color="action" />
                </Box>
              ))}
            </Stack>
          </Paper>

          <Divider />

          {/* Footer Navigation */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have a profile yet?{' '}
              <Link
                component={RouterLink}
                to="/register"
                fontWeight="700"
                color="primary.main"
                underline="hover"
              >
                Create Profile
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
