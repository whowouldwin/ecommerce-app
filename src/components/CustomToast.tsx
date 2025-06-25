import { Box, Flex, Text, CloseButton } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, InfoIcon } from '@chakra-ui/icons';
import React from 'react';

export type ToastStatus = 'success' | 'error' | 'info';

interface CustomToastProps {
  message: string;
  onClose: () => void;
  status?: ToastStatus;
}

const statusStyles = {
  success: {
    bg: 'brand.200',
    icon: <CheckCircleIcon boxSize={5} mr={2} />,
  },
  error: {
    bg: 'red.500',
    icon: <WarningIcon boxSize={5} mr={2} />,
  },
  info: {
    bg: 'brand.200',
    icon: <InfoIcon boxSize={5} mr={2} />,
  },
};

const CustomToast: React.FC<CustomToastProps> = ({
  message,
  onClose,
  status = 'info',
}) => {
  const { bg, icon } = statusStyles[status];

  return (
    <Box bg={bg} color="white" p={4} borderRadius="md" boxShadow="lg">
      <Flex align="center" justify="space-between">
        <Flex align="center">
          {icon}
          <Text>{message}</Text>
        </Flex>
        <CloseButton onClick={onClose} color="white" />
      </Flex>
    </Box>
  );
};

export default CustomToast;
