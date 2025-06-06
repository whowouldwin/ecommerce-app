import React from 'react';
import { Box, Text, Flex, IconButton } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

interface AddressCardProps {
  id: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  apartment?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDefault?: boolean;
  label?: string;
}

const AddressCard: React.FC<AddressCardProps> = ({
  id,
  streetName,
  streetNumber,
  postalCode,
  city,
  apartment,
  onEdit,
  onDelete,
  isDefault,
  label,
}) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={3} w="100%">
      <Flex align="center" justify="space-between" w="100%">
        <Box flex="1" mr={4} overflow="hidden">
          <Text
            fontWeight={isDefault ? 'bold' : 'normal'}
            noOfLines={1}
            isTruncated
          >
            {`${streetName} ${streetNumber}${apartment ? ', Apt ' + apartment : ''}`}
            {label ? ` (${label})` : ''}
          </Text>
          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {`${postalCode}, ${city}`}
          </Text>
        </Box>

        <Flex gap={2} flexShrink={0}>
          <IconButton
            aria-label="Edit address"
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            onClick={() => onEdit(id)}
            isRound
          />
          <IconButton
            aria-label="Delete address"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => onDelete(id)}
            isRound
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default AddressCard;
