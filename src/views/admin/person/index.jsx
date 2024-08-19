import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import ListPerson from './components/ListPerson.js';
import axiosHelper from 'helpers/axios.helper.js';
import { LIST_PATH } from './variables/path.js';
import { AddIcon } from '@chakra-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';

const pageSizeOptions = [10, 20, 30, 40, 50];

export default function Person() {
  const navigate = useHistory();
  const location = useLocation();
  const [docs, setDocs] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSizeOptions[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  const fetchListData = useCallback(async () => {
    try {
      const skip = (page - 1) * limit;
      const result = await axiosHelper.be1.get(`${LIST_PATH}`, {
        params: {
          skip: skip,
          limit: limit,
        },
      });

      const data = lodash.get(result, 'data.metadata.data', []);
      const total = lodash.get(result, 'data.metadata.total', 0);
      if (!lodash.isEmpty(data)) {
        setDocs(data);
        setTotalPages(Math.ceil(total / limit));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSuccess(false);
      setIsUpdateSuccess(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchListData();
  }, [isSuccess, isUpdateSuccess, fetchListData]);

  const handleEditClick = () => {
    navigate.push(`${location.pathname}/create`);
  };

  return (
    <Box pt={{ base: '120px', md: '70px', xl: '70px' }}>
      <SimpleGrid
        columns={{ sm: 1, md: 1, lg: 1, '2xl': 1 }}
        spacing={{ base: '20px', md: '20px', lg: '20px', '2xl': '20px' }}
      >
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          variant="outline"
          size="sm"
          onClick={() => handleEditClick()}
        >
          Thêm mới
        </Button>
        <Box>
          <ListPerson
            docs={docs}
            page={page}
            limit={limit}
            totalPages={totalPages}
            setPage={setPage}
            setLimit={setLimit}
            setIsSuccess={setIsSuccess}
            setIsUpdateSuccess={setIsUpdateSuccess}
          />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
