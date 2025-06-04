import { Box, HStack, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Category } from '@commercetools/platform-sdk';
import { getLocalizedText } from '../../utils/localization';

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

interface CategoryItemProps {
  node: CategoryWithChildren;
  selectedIds: string[];
  onSelect: (id: string) => void;
  level: number;
}

const CategoryItem = ({
  node,
  selectedIds,
  onSelect,
  level,
}: CategoryItemProps) => {
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const selectedColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <>
      <Box pl={level * 4} py={1}>
        <HStack
          spacing={2}
          cursor="pointer"
          onClick={() => onSelect(node.id)}
          _hover={{ bg: 'gray.100', _dark: { bg: 'gray.700' } }}
          w="full"
        >
          {level > 0 && <Icon as={ChevronRightIcon} boxSize={3} />}
          <Text
            fontWeight={selectedIds.includes(node.id) ? 'bold' : 'normal'}
            color={selectedIds.includes(node.id) ? selectedColor : textColor}
          >
            {getLocalizedText(node.name, 'en-US')}
          </Text>
        </HStack>
      </Box>
      {node.children.length > 0 &&
        node.children.map((child) => (
          <CategoryItem
            key={child.id}
            node={child}
            selectedIds={selectedIds}
            onSelect={onSelect}
            level={level + 1}
          />
        ))}
    </>
  );
};

export default CategoryItem;
