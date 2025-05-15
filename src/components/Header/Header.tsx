import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useAppSelector } from '../../store/hooks.ts';
import { selectUser } from '../../features/user/userSlice.ts';

export function Header() {
  const user = useAppSelector(selectUser);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo" />
      </Link>

      {!user.isAuthenticated && (
        <nav className="auth-buttons">
          <Link to="/login">
            <button className="auth-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="auth-button">Register</button>
          </Link>
        </nav>
      )}
    </header>
  );
}
