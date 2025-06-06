import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ProfileForm } from '../profile/sections/ProfileForm';
import { AddressSection } from './sections/adressSection/AddressSection';
import { UserSettings } from './sections/UserSettings';

type Section = 'profile' | 'section2' | 'section3' | 'section4' | 'section5';

interface UserSectionsProps {
  activeSection: Section;
}

export const UserSections: React.FC<UserSectionsProps> = ({
  activeSection,
}) => {
  const Section3 = () => (
    <Box p={6} borderRadius="md">
      <Text>Orders</Text>
    </Box>
  );

  const Section5 = () => (
    <Box p={6} borderRadius="md">
      <Text>Contact</Text>
    </Box>
  );

  switch (activeSection) {
    case 'profile':
      return <ProfileForm />;
    case 'section2':
      return <AddressSection />;
    case 'section3':
      return <Section3 />;
    case 'section4':
      return <UserSettings />;
    case 'section5':
      return <Section5 />;
    default:
      return null;
  }
};
