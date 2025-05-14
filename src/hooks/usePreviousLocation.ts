import { useLocation, useNavigate } from 'react-router-dom';

export const usePreviousLocation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    const from = location.state?.from || '/';
    navigate(from, { replace: true });
  };

  return { from: location.state?.from || '/', goBack };
};
