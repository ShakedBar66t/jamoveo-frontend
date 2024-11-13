import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Signup from './components/Signup';
import Login from './components/Login';
import MainPage from './components/MainPage';
import LivePage from './components/LivePage';
import SignupAdmin from './components/SignupAdmin';

function App() {
  const [sessionId, setSessionId] = useState<string>('')
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/admin" element={<SignupAdmin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/live" element={<LivePage sessionId={sessionId} setSessionId={setSessionId} />} />
          <Route path="/" element={<MainPage sessionId={sessionId} setSessionId={setSessionId} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
