import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Transfer } from './pages/Transfer';
import { Layout } from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route
        path="/home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/transfer"
        element={
          <Layout>
            <Transfer />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App