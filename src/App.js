import React, { useEffect } from 'react';
import logo from './assets/anh-ech-meme.jpg';
import './App.css';
import MainLayout from './layout/MainLayout';
import { useTheme } from '@mui/material/styles';

function App() {
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.body.background;
  }, [theme]);

  return (
    <MainLayout>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo} className="App-logo" alt="logo" />
          <img src={logo} className="App-logo" alt="logo" />
        </header>
      </div>
    </MainLayout>
  );
}

export default App;
