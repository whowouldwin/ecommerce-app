import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from './pages/LoginPage.tsx';
import MainPage from './pages/MainPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { store } from './store/store.ts';
import Layout from './components/Layout/Layout';
import AboutPage from './pages/AboutPage';
import DeliveryPage from './pages/DeliveryPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
                <RegisterPage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
