import { Box, Button, Flex, FormControl, FormLabel, Input, Select, SimpleGrid, Spinner } from '@chakra-ui/react';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import axiosHelper from 'helpers/axios.helper.js';
import { LIST_PATH } from '../../variables/path.js';
import Card from 'components/card/Card';
import { StatusToVN, Status, MaritalStatus as MaritalStatusEnum, MaritalStatusToVN } from 'constants/model.constant.js';
import { LIST_PATH as GROUP_LIST_PATH } from 'views/admin/group/variables/path.js';
import { LIST_PATH as BRANCH_LIST_PATH } from 'views/admin/branch/variables/path.js';
import { RepeatIcon } from '@chakra-ui/icons';

/**
 * Page for displaying list of persons
 * @param {object} props - props of component
 * @returns {ReactElement} component element
 */

export default function SearchFilters({ page, limit, setDocs, setTotalPages }) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchType, setSearchType] = useState('ln');
  const [searchValue, setSearchValue] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [status, setStatus] = useState(null);
  const [maritalStatus, setMaritalStatus] = useState(null);
  const [genNum, setGenNum] = useState('');
  const [group, setGroup] = useState('');
  const [branch, setBranch] = useState('');
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  const fetchListData = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const result = await axiosHelper.be1.get(LIST_PATH, {
        params: {
          skip,
          limit,
          [searchType]: searchValue,
          searchValue,
          fromDate,
          toDate,
          status,
          maritalStatus,
          genNum,
          group,
          branch,
        },
      });

      const data = lodash.get(result, 'data.metadata.data', []);
      const total = lodash.get(result, 'data.metadata.total', 0);
      setDocs(data);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.log(error);
      setDocs([]);
      setTotalPages(0);
    }
  }, [page, limit, searchType, searchValue, fromDate, toDate, status, maritalStatus, genNum, group, branch]);

  const handleSubmit = (e) => {
    setShouldFetch(true);
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchListData();
      setShouldFetch(false);
    }
  }, [shouldFetch, fetchListData]);

  /** Groups */
  const fetchGroups = async () => {
    try {
      setIsGroupLoading(true);
      const result = await axiosHelper.be1.get(GROUP_LIST_PATH);
      const data = lodash.get(result, 'data.metadata.data', []);
      if (!lodash.isEmpty(data)) {
        setGroups(data);
      }
    } catch (error) {
      setGroups([]);
    } finally {
      setIsGroupLoading(false);
    }
  };

  const handleGroupOpen = () => {
    fetchGroups();
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
    setBranch('');
  };

  /** Branchs */
  const fetchBranches = async () => {
    try {
      if (group) {
        setIsBranchLoading(true);
        const result = await axiosHelper.be1.get(`${BRANCH_LIST_PATH}?g=${group}`);
        const data = lodash.get(result, 'data.metadata.data', []);
        if (!lodash.isEmpty(data)) {
          setBranches(data);
        }
      } else {
        setBranches([]);
      }
    } catch (error) {
      setBranches([]);
    } finally {
      setIsBranchLoading(false);
    }
  };

  const handleBranchOpen = () => {
    fetchBranches();
  };

  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };

  const handleReset = () => {
    setSearchType('ln');
    setSearchValue('');
    setFromDate('');
    setToDate('');
    setStatus('');
    setMaritalStatus('');
    setGenNum('');
    setGroup('');
    setBranch('');
  };

  return (
    <Card>
      {/* Tìm kiếm theo tên - cmnd - họ và tên - sức khỏe - hôn nhân */}
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

        <FormControl mr={4}>
          <FormLabel>Giá trị tìm kiếm</FormLabel>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Nhập giá trị tìm kiếm"
          />
        </FormControl>

        <FormControl mr={4}>
          <FormLabel htmlFor="status">Tình trạng sức khỏe</FormLabel>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={''}>{'Tất cả'}</option>
            <option value={Status.UNKNOWN}>{StatusToVN.UNKNOWN}</option>
            <option value={Status.ALIVE}>{StatusToVN.ALIVE}</option>
            <option value={Status.DEAD}>{StatusToVN.DEAD}</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="maritalStatus">Tình trạng hôn nhân</FormLabel>
          <Select
            id="maritalStatus"
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
          >
            <option value={''}>{'Tất cả'}</option>
            <option value={MaritalStatusEnum.UNKNOWN}>{MaritalStatusToVN.UNKNOWN}</option>
            <option value={MaritalStatusEnum.SINGLE}>{MaritalStatusToVN.SINGLE}</option>
            <option value={MaritalStatusEnum.MARRIED}>{MaritalStatusToVN.MARRIED}</option>
            <option value={MaritalStatusEnum.DIVORCED}>{MaritalStatusToVN.DIVORCED}</option>
          </Select>
        </FormControl>
      </Flex>

      {/* Tìm kiếm theo ngày sinh, phái chi đời */}
      <Flex
        direction="row"
        align="flex-start"
        justify="space-between"
        mb={4}
      >
        <FormControl mr={4}>
          <FormLabel>Ngày sinh từ</FormLabel>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </FormControl>

        <FormControl mr={4}>
          <FormLabel>Ngày sinh đến</FormLabel>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </FormControl>

        {/* Phái */}
        <FormControl mr={4}>
          <FormLabel htmlFor="group">Phái</FormLabel>
          <Select
            placeholder="Chọn phái"
            onFocus={handleGroupOpen}
            onChange={handleGroupChange}
            value={group}
          >
            {isGroupLoading ? (
              <option
                value=""
                disabled
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner size="sm" />
                </Box>
              </option>
            ) : (
              groups.map((group) => (
                <option
                  key={group._id}
                  value={group._id}
                >
                  {group.name}
                </option>
              ))
            )}
          </Select>
        </FormControl>

        {/* Chi */}
        <FormControl mr={4}>
          <FormLabel htmlFor="branch">Chi</FormLabel>
          <Select
            placeholder="Chọn chi"
            onFocus={handleBranchOpen}
            onChange={handleBranchChange}
            value={branch}
          >
            {isBranchLoading ? (
              <option
                value=""
                disabled
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner size="sm" />
                </Box>
              </option>
            ) : (
              branches.map((branch) => (
                <option
                  key={branch._id}
                  value={branch._id}
                >
                  {branch.name}
                </option>
              ))
            )}
          </Select>
        </FormControl>

        {/* Đời */}
        <FormControl>
          <FormLabel htmlFor="genNum">Đời</FormLabel>
          <Input
            id="genNum"
            placeholder="Đời thứ"
            type="number"
            value={genNum}
            onChange={(e) => setGenNum(e.target.value)}
          />
        </FormControl>
      </Flex>

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
