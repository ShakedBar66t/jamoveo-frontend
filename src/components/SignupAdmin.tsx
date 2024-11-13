import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from '@mui/material';

const instruments = [
  'Drums',
  'Guitar',
  'Bass',
  'Saxophone',
  'Keyboards',
  'Vocals',
  'Other',
];

const SignupAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, 'users', userCredential.user.uid), {
        email,
        instrument,
        role: 'admin',
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={8}
        mb={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Signup
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          select
          label="Instrument"
          variant="outlined"
          fullWidth
          margin="normal"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          {instruments.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          onClick={handleSignup}
          sx={{ mt: 3 }}
        >
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignupAdmin;
