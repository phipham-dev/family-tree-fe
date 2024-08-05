import React from 'react';
import { Button, Box, Text, VStack, HStack } from '@chakra-ui/react';
import lodash from 'lodash';
import { StatusToVN } from 'constants/model.constant.js';
import { MaritalStatusToVN } from 'constants/model.constant.js';
import { convertTime } from 'utils/time.util.js';

const MiniInfoPerson = ({ person, setPerson, removePerson }) => {
  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack
        align="start"
        spacing={3}
      >
        <Text fontWeight="bold">
          <strong>Họ và tên</strong>: {person.fullName}
        </Text>
        <Text fontWeight="bold">
          <strong>CCCD/CMND</strong>: {person.cic}
        </Text>
        <Text fontWeight="bold">
          <strong>Ngày sinh</strong>: {convertTime(person.dateOfBirth)}
        </Text>
        <Text fontWeight="bold">
          <strong>Nơi sinh</strong>: {person.placeOfBirth}
        </Text>
        <Text fontWeight="bold">
          <strong>Tình trạng</strong>: {StatusToVN[person.status]}
        </Text>
        <Text fontWeight="bold">
          <strong>Tình trạng hôn nhân</strong>: {MaritalStatusToVN[person.maritalStatus]}
        </Text>
      </VStack>
      <HStack
        spacing={4}
        mt={4}
      >
        <Button
          colorScheme="red"
          onClick={() => {
            if (lodash.isFunction(removePerson)) {
              removePerson(person);
            }
            setPerson();
          }}
        >
          Xóa
        </Button>
      </HStack>
    </Box>
  );
};

export default MiniInfoPerson;
