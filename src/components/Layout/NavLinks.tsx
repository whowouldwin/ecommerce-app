import { Link } from '@chakra-ui/react';
import { useLocation, matchPath, Link as RouterLink } from 'react-router-dom';
import { useColorModeValue } from '@chakra-ui/react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About Us', to: '/about' },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
  const location = useLocation();
  const activeColor = useColorModeValue('secondary', 'brand.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <>
      {navLinks.map(({ label, to }) => {
        const match = matchPath({ path: to, end: true }, location.pathname);
        const isActive = Boolean(match);

        return (
          <Link
            as={RouterLink}
            key={to}
            to={to}
            onClick={onClick}
            fontWeight={isActive ? 'bold' : 'normal'}
            color={isActive ? activeColor : inactiveColor}
            _hover={{ textDecoration: 'none', color: activeColor }}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
