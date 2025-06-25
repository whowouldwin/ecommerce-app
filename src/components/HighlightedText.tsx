import React from 'react';
import { Text, Box } from '@chakra-ui/react';

interface HighlightedTextProps {
  text: string;
  highlight: string;
  noOfLines?: number;
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  mb?: number | string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  highlight,
  noOfLines,
  fontSize = 'md',
  color = 'inherit',
  fontWeight = 'normal',
  mb,
}) => {
  if (!highlight.trim()) {
    return (
      <Text
        fontSize={fontSize}
        color={color}
        fontWeight={fontWeight}
        noOfLines={noOfLines}
        mb={mb}
      >
        {text}
      </Text>
    );
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return (
    <Text
      fontSize={fontSize}
      color={color}
      fontWeight={fontWeight}
      noOfLines={noOfLines}
      mb={mb}
    >
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Box
            as="span"
            key={i}
            bg="yellow.200"
            color="black"
            px={1}
            borderRadius="sm"
            fontWeight="medium"
          >
            {part}
          </Box>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </Text>
  );
};

export default HighlightedText;
