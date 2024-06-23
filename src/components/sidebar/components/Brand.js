import React from 'react';

// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';

// Custom components
// import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
import horizonSoloImage from 'assets/img/logo/horizone-logo.png';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex
      align="center"
      direction="column"
    >
      {/* Note: Logo */}
      <Image
        src={horizonSoloImage}
        alt="Horizon Solo"
        boxSize="200px" // Kích thước hình ảnh
        objectFit="cover" // Đảm bảo hình ảnh không bị căn chỉnh
      />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
