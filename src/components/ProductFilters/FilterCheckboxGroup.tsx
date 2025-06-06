import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Heading,
  AccordionIcon,
  CheckboxGroup,
  Stack,
  Checkbox,
  Text,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { getLocalizedText } from '../../utils/localization';
import { FilterState } from '../../features/filter/filterSlice';

interface Props {
  label: string;
  filterKey: keyof Pick<FilterState, 'brand' | 'color' | 'size' | 'materials'>;
  options: string[];
  values: string[];
  loading: boolean;
  onChange: (values: string[]) => void;
}

const FilterCheckboxGroup = ({
  label,
  options,
  values,
  loading,
  onChange,
}: Props) => (
  <AccordionItem>
    <h2>
      <AccordionButton py={{ base: 2, md: 3 }}>
        <Box flex="1" textAlign="left">
          <Heading size={{ base: 'xs', md: 'sm' }}>{label}</Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={{ base: 3, md: 4 }}>
      {loading ? (
        <Flex justify="center" py={2}>
          <Spinner size="sm" />
        </Flex>
      ) : (
        <CheckboxGroup value={values} onChange={onChange}>
          <Stack spacing={{ base: 0.5, md: 1 }}>
            {options.length > 0 ? (
              options.map((value) => (
                <Checkbox
                  key={value}
                  value={value}
                  size={{ base: 'sm', md: 'md' }}
                >
                  {getLocalizedText({ en: value })}
                </Checkbox>
              ))
            ) : (
              <Text fontSize="sm" color="gray.500">
                No {label.toLowerCase()} available
              </Text>
            )}
          </Stack>
        </CheckboxGroup>
      )}
    </AccordionPanel>
  </AccordionItem>
);

export default FilterCheckboxGroup;
