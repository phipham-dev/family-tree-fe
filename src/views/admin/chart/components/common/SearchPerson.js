import React, { useEffect, useState } from 'react';
import lodash from 'lodash';
import {
  Box,
  Button,
  Input,
  Select,
  Stack,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Table,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import axiosHelper from 'helpers/axios.helper.js';
import { LIST_PATH } from '../../variables/path.js';
import convertMaritalStatus from 'utils/convertMaritalStatus.js';
import convertLiveStatus from 'utils/convertLiveStatus.js';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { convertTime } from 'utils/time.util.js';

const headerGroups = ['Họ và tên', 'CMND/CCCD', 'Ngày sinh', 'Nơi sinh', 'Hôn nhân', 'Trạng thái', 'Hành động'];
const pageSizeOptions = [10, 20, 30, 40, 50];

const SearchPerson = ({ onSelected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('cic');

  const [docs, setDocs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSizeOptions[0]);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async () => {
    try {
      let param = '';
      if (searchOption === 'cic') {
        param = 'cic';
      } else if (searchOption === 'lastName') {
        param = 'ln';
      } else if (searchOption === 'fullName') {
        param = 'fn';
      }

      const skip = (page - 1) * limit;

      const response = await axiosHelper.be1.get(`${LIST_PATH}`, {
        params: {
          skip: skip,
          limit: limit,
          [param]: searchTerm,
        },
      });

      const data = lodash.get(response, 'data.metadata.data', []);
      const total = lodash.get(response, 'data.metadata.total', 0);
      setDocs(data);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error('Đã xảy ra lỗi khi gọi API:', error);
    }
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = async (event) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset lại trang về 1 khi thay đổi limit
  };

  useEffect(() => {
    handleSearch();
  }, [page, limit]);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box p={4}>
      <Stack
        spacing={4}
        mb={4}
      >
        <Select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
          placeholder="Chọn tùy chọn tìm kiếm"
        >
          <option value="cic">Tìm theo CMND</option>
          <option value="lastName">Tìm theo Tên</option>
          <option value="fullName">Tìm theo Họ và tên</option>
        </Select>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập từ khóa tìm kiếm"
        />
        <Button
          colorScheme="blue"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </Stack>

      {/* Render data */}
      <Box>
        {docs.length > 0 && (
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
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          mr={2}
                          onClick={() => {
                            onSelected(e);
                          }}
                        >
                          Chọn
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Box>

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
    </Box>
  );
};

export default SearchPerson;
