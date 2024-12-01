import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const { token } = response.data;
      const userResponse = await axios.get('http://localhost:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userResponse.data;
      login(user, token);
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container>
      <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
