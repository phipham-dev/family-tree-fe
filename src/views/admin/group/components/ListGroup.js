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
// Custom components
import Card from 'components/card/Card';
import React, { useState } from 'react';
import { convertTime } from 'utils/time.util.js';
import EditGroup from './EditGroup.js';

const headerGroups = ['Tên', 'Mã', 'Ngày tạo', 'Ngày cập nhật', 'Trạng thái', 'Hành động'];
const pageSizeOptions = [10, 20, 30, 40, 50];

export default function ListGroup({ docs, page, limit, totalPages, setPage, setLimit, setIsUpdateSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset lại trang về 1 khi thay đổi limit
  };

  const handleEditClick = (branch) => {
    setSelectedDoc(branch);
    onOpen();
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  return (
    <Card>
      <Flex
        px="25px"
        justify="space-between"
        mb="20px"
        align="center"
      >
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Danh sách
        </Text>
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
                    {e.name}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {e.code}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {convertTime(e.createdAt, 'DD-MM-YYYY HH:mm:ss')}
                  </Text>
                </Td>
                <Td>
                  <Text
                    color={textColor}
                    fontSize={{ sm: '10px', lg: '12px' }}
                    fontWeight="700"
                  >
                    {convertTime(e.updatedAt, 'DD-MM-YYYY HH:mm:ss')}
                  </Text>
                </Td>
                <Td>
                  <Flex>
                    <Icon
                      as={e.activated ? CheckCircleIcon : CloseIcon} // Sử dụng ternary operator để chọn biểu tượng
                      boxSize={4} // Kích thước của biểu tượng
                      color={e.activated ? 'green.500' : 'red.500'} // Màu sắc của biểu tượng
                    />
                  </Flex>
                </Td>
                <Td>
                  <Flex>
                    <Button
                      leftIcon={<EditIcon />}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      mr={2}
                      onClick={() => handleEditClick(e)}
                    >
                      Chỉnh sửa
                    </Button>
                    {/* <Button
                      leftIcon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      size="sm"
                      // ml={2}
                    >
                      Delete
                    </Button> */}
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {selectedDoc && (
        <EditGroup
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
          isOpen={isOpen}
          onClose={onClose}
          setIsUpdateSuccess={setIsUpdateSuccess}
        />
      )}
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
            isDisabled={page >= totalPages}
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
