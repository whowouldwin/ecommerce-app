import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import LoginPage from './pages/LoginPage.tsx';
import MainPage from './pages/MainPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { index } from './store';

function App() {
  return (
    <Provider store={index}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export { App };
