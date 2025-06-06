import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Heading,
  AccordionIcon,
  Text,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from '@chakra-ui/react';

interface Props {
  value: [number, number];
  onChange: (val: [number, number]) => void;
}

const PriceRangeFilter = ({ value, onChange }: Props) => (
  <AccordionItem>
    <h2>
      <AccordionButton py={{ base: 2, md: 3 }}>
        <Box flex="1" textAlign="left">
          <Heading size={{ base: 'xs', md: 'sm' }}>Price Range</Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={{ base: 3, md: 4 }}>
      <Text mb={{ base: 1, md: 2 }} fontSize={{ base: 'sm', md: 'md' }}>
        Price: €{value[0].toFixed(2)} – €{value[1].toFixed(2)}
      </Text>
      <RangeSlider
        aria-label={['min', 'max']}
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
        size={{ base: 'sm', md: 'md' }}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>
        <RangeSliderThumb index={0} />
        <RangeSliderThumb index={1} />
      </RangeSlider>
    </AccordionPanel>
  </AccordionItem>
);

export default PriceRangeFilter;
