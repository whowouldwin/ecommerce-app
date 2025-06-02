import React, { useState } from 'react';
import {
  Box,
  Text,
  Avatar,
  Flex,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { SettingsIcon, InfoIcon } from '@chakra-ui/icons';
import { FaUser, FaMapMarkerAlt, FaBox } from 'react-icons/fa';
import Header from '../components/Layout/Header';
import { useAppSelector } from '../store/hooks';
import { selectUser } from '../features/user/userSlice';
import { UserSections } from '../components/profile/UserSections';
import { SidebarButton } from '../components/profile/SidebarButton';
import { Section } from '../types/types';

const ProfilePage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const sidebarBg = useColorModeValue('gray.50', 'gray.800');

  return (
    <>
      <Header />
      <Flex
        maxW="6xl"
        mx="auto"
        mt={10}
        p={6}
        gap={10}
        justify="space-between"
        flexWrap="wrap"
      >
        <Box
          flex="0 0 220px"
          p={4}
          borderRadius="md"
          bg={sidebarBg}
          minH="300px"
        >
          <VStack spacing={4} align="stretch">
            <Flex direction="column" align="center" mb={4}>
              <Avatar
                size="xl"
                name={`${user.firstName ?? ''} ${user.lastName ?? ''}`}
              />
              <Text mt={2} fontWeight="bold">
                Hellow, {user.firstName ?? 'User'}
              </Text>
            </Flex>

            <SidebarButton
              label="User Profile"
              section="profile"
              activeSection={activeSection}
              onClick={setActiveSection}
              icon={<FaUser />}
            />
            <SidebarButton
              label="Address"
              section="section2"
              activeSection={activeSection}
              onClick={setActiveSection}
              icon={<FaMapMarkerAlt />}
            />
            <SidebarButton
              label="Orders"
              section="section3"
              activeSection={activeSection}
              onClick={setActiveSection}
              icon={<FaBox />}
            />
            <SidebarButton
              label="Settings"
              section="section4"
              activeSection={activeSection}
              onClick={setActiveSection}
              icon={<SettingsIcon />}
            />
            <SidebarButton
              label="Contact"
              section="section5"
              activeSection={activeSection}
              onClick={setActiveSection}
              icon={<InfoIcon />}
            />
          </VStack>
        </Box>

        <Box flex="1" minW="300px">
          <UserSections activeSection={activeSection} />
        </Box>
      </Flex>
    </>
  );
};

export default ProfilePage;
