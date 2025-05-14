import { Link } from 'react-router-dom';
import { TestForm } from '../components/TestForm/TestForm.tsx';

export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <Link to="/register">Go to Register</Link>
      <TestForm />
    </div>
  );
}
