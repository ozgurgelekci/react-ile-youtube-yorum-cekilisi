import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import AppToolbar from './components/Toolbar';
import CekilisYap from './components/CekilisYap';

const App = () => {
  return (
    <Router>
      <div>
        <AppToolbar />
        <Container>
          <Routes>
            <Route path="/" element={<CekilisYap />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
