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
      <AccordionButton>
        <Box flex="1" textAlign="left">
          <Heading size="sm">Price Range</Heading>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <Text mb={2}>
        Price: €{value[0].toFixed(2)} – €{value[1].toFixed(2)}
      </Text>
      <RangeSlider
        aria-label={['min', 'max']}
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={onChange}
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
