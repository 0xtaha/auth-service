import { useState } from 'react';
import { Container, Paper, Typography, Button, Box, Avatar, CircularProgress } from '@mui/material';
import { Logout, Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'primary.main',
              width: 80,
              height: 80,
              fontSize: '2rem',
            }}
          >
            <Person fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h3" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Welcome to the application.
          </Typography>
          <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>
            Hello, {user?.name}!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            {user?.email}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={isLoggingOut ? <CircularProgress size={20} /> : <Logout />}
            onClick={handleLogout}
            disabled={isLoggingOut}
            sx={{ mt: 2 }}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;