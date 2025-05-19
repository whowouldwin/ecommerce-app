import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Layout from './components/Layout/Layout';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import DeliveryPage from './pages/DeliveryPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './routes/ProtectedRoute.tsx';
import { store } from './store/store.ts';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout showAuthButtons>
                <MainPage />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout showAuthButtons>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/delivery"
            element={
              <Layout showAuthButtons>
                <DeliveryPage />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <ProtectedRoute authenticationRequired={false}>
                  <RegisterPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <ProtectedRoute authenticationRequired={false}>
                  <LoginPage />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export { App };
