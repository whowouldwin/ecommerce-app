import { Button, useColorModeValue } from '@chakra-ui/react';
import { ReactElement } from 'react';
import React from 'react';
import { Section } from '../../types/types';

interface SidebarButtonProps {
  label: string;
  section: Section;
  activeSection: Section;
  onClick: (section: Section) => void;
  icon?: ReactElement;
}

export const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  section,
  activeSection,
  onClick,
  icon,
}) => {
  const isActive = activeSection === section;
  const textColor = useColorModeValue('black', 'white');
  const activeBg = useColorModeValue('gray.300', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Button
      variant="ghost"
      color={textColor}
      bg={isActive ? activeBg : 'transparent'}
      _hover={{ bg: isActive ? activeBg : hoverBg }}
      fontWeight={isActive ? 'bold' : 'normal'}
      onClick={() => onClick(section)}
      width="100%"
      justifyContent="flex-start"
      leftIcon={icon}
    >
      {label}
    </Button>
  );
};
