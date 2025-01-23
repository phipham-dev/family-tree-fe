import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Spinner } from '@chakra-ui/react';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import axiosHelper from 'helpers/axios.helper.js';
import { LIST_PATH } from '../../variables/path.js';
import Card from 'components/card/Card';
import { RepeatIcon } from '@chakra-ui/icons';

export default function SearchFilters({ page, limit, setDocs, setTotalPages }) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchOption, setSearchOption] = useState('leader'); // 'leader' or 'generation'
  const [searchType, setSearchType] = useState('ln');
  const [searchValue, setSearchValue] = useState('');
  const [genNum, setGenNum] = useState('');

  const fetchListData = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const params = {
        skip,
        limit,
      };

      // Add search parameters based on selected option
      if (searchOption === 'leader') {
        params[searchType] = searchValue;
      } else {
        params.genNum = genNum;
      }

      const result = await axiosHelper.be1.get(LIST_PATH, { params });

      const data = lodash.get(result, 'data.metadata.data', []);
      const total = lodash.get(result, 'data.metadata.total', 0);
      setDocs(data);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.log(error);
      setDocs([]);
      setTotalPages(0);
    }
  }, [page, limit, searchOption, searchType, searchValue, genNum]);

  const handleSubmit = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchListData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchListData]);

  const handleReset = () => {
    setSearchOption('leader');
    setSearchType('ln');
    setSearchValue('');
    setGenNum('');
  };

  return (
    <Card>
      <FormControl mb={4}>
        <FormLabel>Loại tìm kiếm</FormLabel>
        <Select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="leader">Tìm kiếm theo người đứng đầu</option>
          <option value="generation">Tìm kiếm theo Đời</option>
        </Select>
      </FormControl>

      {searchOption === 'leader' ? (
        <Flex
          direction="row"
          align="flex-start"
          justify="space-between"
          mb={4}
        >
          <FormControl mr={4}>
            <FormLabel>Tìm kiếm theo</FormLabel>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="ln">Tên</option>
              <option value="cic">CMND</option>
              <option value="fn">Họ và tên</option>
              <option value="ph">Số điện thoại</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Giá trị tìm kiếm</FormLabel>
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Nhập giá trị tìm kiếm"
            />
          </FormControl>
        </Flex>
      ) : (
        <FormControl mb={4}>
          <FormLabel>Đời thứ</FormLabel>
          <Input
            type="number"
            value={genNum}
            onChange={(e) => setGenNum(e.target.value)}
            placeholder="Nhập số đời"
          />
        </FormControl>
      )}

      <Flex
        direction="row"
        align="center"
      >
        <Button
          colorScheme="teal"
          onClick={handleSubmit}
          mr={3}
        >
          Tìm kiếm
        </Button>
        <RepeatIcon
          cursor="pointer"
          onClick={handleReset}
        />
      </Flex>
    </Card>
  );
}
