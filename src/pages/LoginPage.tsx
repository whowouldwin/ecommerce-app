import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TestForm } from '../components/TestForm/TestForm.tsx';
import { useAppSelector } from '../store/hooks.ts';
import { selectUser } from '../features/user/userSlice.ts';

export default function LoginPage() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/');
    }
  }, [navigate, user]);
  return (
    <div>
      <h1>Login</h1>
      <Link to="/register">Go to Register</Link>
      <TestForm />
    </div>
  );
}
