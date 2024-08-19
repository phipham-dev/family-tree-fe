import React from 'react';
import { Button, Box, Text, VStack, HStack } from '@chakra-ui/react';
import lodash from 'lodash';
import { StatusToVN } from 'constants/model.constant.js';
import { MaritalStatusToVN } from 'constants/model.constant.js';
import { convertTime } from 'utils/time.util.js';

const MiniInfoPerson = ({ information, onSet = null, onRemove }) => {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      mr={4}
      width={300}
      fontSize={12}
    >
      <VStack
        align="start"
        // spacing={1}
      >
        <Text fontWeight="bold">{information.fullName}</Text>
        <Text>{information.cic}</Text>
        <Text>{convertTime(information.dateOfBirth)}</Text>
        <Text>{information.placeOfBirth}</Text>
        <Text>{StatusToVN[information.status]}</Text>
        <Text>{MaritalStatusToVN[information.maritalStatus]}</Text>
      </VStack>
      <HStack
        spacing={4}
        mt={4}
        justifyContent="flex-end"
      >
        <Button
          size="sm"
          colorScheme="red"
          onClick={() => {
            if (lodash.isFunction(onRemove)) {
              onRemove(information);
            }

            if (lodash.isFunction(onSet)) {
              onSet({});
            }
          }}
        >
          Xóa
        </Button>
      </HStack>
    </Box>
  );
};

export default MiniInfoPerson;
