/* eslint-disable */
import { EditIcon, ArrowForwardIcon, ArrowBackIcon, CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';
// Custom components
import Card from 'components/card/Card';
import React, { useState } from 'react';
import { convertTime } from 'utils/time.util.js';
import convertMaritalStatus from 'utils/convertMaritalStatus.js';
import convertLiveStatus from 'utils/convertLiveStatus.js';
import { MdAccountTree, MdAddCircle } from 'react-icons/md';

const headerGroups = ['Họ và tên', 'CMND/CCCD', 'Ngày sinh', 'Nơi sinh', 'SĐT', 'Hôn nhân', 'Trạng thái', 'Hành động'];
const pageSizeOptions = [10, 20, 30, 40, 50];

export default function ListPerson({ docs, page, limit, totalPages, setPage, setLimit, setIsUpdateSuccess }) {
  const navigate = useHistory();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset lại trang về 1 khi thay đổi limit
  };

  const onDrawVerticalFamilyTree = (doc) => {
    setSelectedDoc(doc);
    navigate.push(`${location.pathname}/vertical-family?id=${doc._id}`);
  };

  const onAddPerson = () => {
    navigate.push(`${location.pathname}/create`);
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  return (
    <Card>
      <Flex
        px="25px"
        justify="flex-start"
        mb="20px"
        align="center"
      >
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
          mr="10px"
        >
          Danh sách
        </Text>
        <Icon
          as={MdAddCircle}
          w={8}
          h={8}
          color="teal"
          onClick={onAddPerson}
          cursor="pointer"
        />
      </Flex>
      <Table
        variant="simple"
        color="gray.500"
        mb="24px"
      >
        <Thead>
          <Tr>
            {headerGroups.map((v, i) => {
              return (
                <Th
                  key={i}
                  pe="10px"
                  align="center"
                  fontSize={{ sm: '10px', lg: '12px' }}
                  borderColor={borderColor}
                  color="gray.400"
                >
                  {v}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {docs.map((e) => {
            return (
              <Tr key={e._id}>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {e.fullName}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {e.cic}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {convertTime(e.dateOfBirth, 'DD-MM-YYYY')}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {e.placeOfBirth}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {e.phoneNumber}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {convertMaritalStatus(e.maritalStatus)}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {convertLiveStatus(e.status)}
                  </Text>
                </Td>

                <Td>
                  <Flex>
                    <Button
                      leftIcon={<MdAccountTree />}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      mr={2}
                      onClick={() => onDrawVerticalFamilyTree(e)}
                    >
                      Xem cây gia phả
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={4}
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <Button
            onClick={() => handlePageChange(page - 1)}
            isDisabled={page === 1}
            leftIcon={<ArrowBackIcon />}
          ></Button>
          <Box mx={2}>
            {page} / {totalPages}
          </Box>
          <Button
            onClick={() => handlePageChange(page + 1)}
            isDisabled={page === totalPages}
            rightIcon={<ArrowForwardIcon />}
          ></Button>
        </Box>
        <Select
          value={limit}
          onChange={handleLimitChange}
          width="100px"
        >
          {pageSizeOptions.map((v, i) => (
            <option
              key={i}
              value={v}
            >
              {v}
            </option>
          ))}
        </Select>
      </Box>
    </Card>
  );
}
