import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks.ts';
import { logoutUser } from '../../features/user/userSlice.ts';

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => navigate('/'))
      .catch((e) => console.error(e));
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export { LogoutButton };
