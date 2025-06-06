import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { FiUser } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProfileIconButtonProps {
  user: {
    isAuthenticated: boolean;
  };
}

const ProfileIconButton: React.FC<ProfileIconButtonProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = location.pathname === '/profile';

  return (
    user.isAuthenticated && (
      <Tooltip label="Profile" hasArrow>
        <IconButton
          icon={<FiUser />}
          variant={isActive ? 'solid' : 'ghost'}
          colorScheme={isActive ? 'blue' : undefined}
          aria-label="User Profile"
          onClick={() => !isActive && navigate('/profile')}
          isDisabled={isActive}
          cursor={isActive ? 'default' : 'pointer'}
          aria-current={isActive ? 'page' : undefined}
        />
      </Tooltip>
    )
  );
};

export default ProfileIconButton;
