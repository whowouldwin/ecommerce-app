import { Image as ImageType } from '@commercetools/platform-sdk';
import { Image, IconButton, HStack, Flex } from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { FC, useState } from 'react';

interface ImageBlockProps {
  imageData: ImageType[];
  imageIndexProps: number;
  callBack: (index: number, action: 'open' | 'close') => void;
  typeBlock: string;
}

const ImageBlock: FC<ImageBlockProps> = ({
  imageData,
  imageIndexProps,
  callBack,
  typeBlock,
}) => {
  const [imageIndex, setImageIndex] = useState(imageIndexProps);
  const [showImage, setShowImage] = useState(true);

  const handlePrev = () => {
    if (imageIndex > 0) {
      setShowImage(false);
      setTimeout(() => {
        setImageIndex(imageIndex - 1);
        setShowImage(true);
      }, 150);
    }
  };

  const handleNext = () => {
    if (imageIndex < imageData.length - 1) {
      setShowImage(false);
      setTimeout(() => {
        setImageIndex(imageIndex + 1);
        setShowImage(true);
      }, 150);
    }
  };

  return (
    <Flex
      flexDirection="column"
      maxW={typeBlock === 'base' ? { md: '50%' } : ''}
      height="100%"
    >
      <Flex alignItems="center" position="relative" w="full" h="100%">
        {imageIndex > 0 && (
          <IconButton
            icon={<ChevronLeftIcon />}
            position="absolute"
            left="0"
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrev}
            aria-label="Previous image"
            variant="ghost"
            color="white"
            zIndex="1"
          />
        )}

        <Image
          src={imageData[imageIndex].url}
          alt={imageData[imageIndex].label}
          mx="auto"
          maxH={typeBlock === 'base' ? '320px' : ''}
          objectFit="contain"
          opacity={showImage ? 1 : 0}
          transition="opacity 0.3s ease-in-out"
          borderRadius="sm"
          onClick={() => {
            if (typeBlock === 'base') callBack(imageIndex, 'open');
          }}
        />

        {imageIndex < imageData.length - 1 && (
          <IconButton
            icon={<ChevronRightIcon />}
            position="absolute"
            right="0"
            top={'50%'}
            transform="translateY(-50%)"
            onClick={handleNext}
            aria-label="Next image"
            variant="ghost"
            color="white"
            zIndex="1"
          />
        )}

        {typeBlock === 'modal' && (
          <IconButton
            icon={<SmallCloseIcon />}
            position="absolute"
            right="0"
            top="10px"
            onClick={() => {
              callBack(imageIndex, 'close');
            }}
            aria-label="Next image"
            variant="ghost"
            color="white"
            zIndex="1"
          />
        )}
      </Flex>

      {imageData.length > 1 && (
        <HStack
          h="70px"
          spacing={3}
          overflowX="auto"
          css={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              border: '1px solid grey',
              borderRadius: '5px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'grey',
              borderRadius: '5px',
            },
          }}
        >
          {imageData.map((img, index) => (
            <Image
              key={index}
              src={img.url}
              alt={img.label}
              boxSize="50px"
              objectFit="cover"
              borderRadius="md"
              border={
                index === imageIndex
                  ? '2px solid white'
                  : '2px solid transparent'
              }
              cursor="pointer"
              onClick={() => {
                setShowImage(false);
                setTimeout(() => {
                  setImageIndex(index);
                  setShowImage(true);
                }, 150);
              }}
              transition="all 0.2s"
              _hover={{ opacity: 0.8 }}
            />
          ))}
        </HStack>
      )}
    </Flex>
  );
};

export default ImageBlock;
