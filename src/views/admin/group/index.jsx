import { Box, SimpleGrid } from '@chakra-ui/react';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import ListGroup from './components/ListGroup.js';
import CreateGroup from './components/CreateGroup.js';
import axiosHelper from 'helpers/axios.helper.js';
import { LIST_PATH } from './variables/path.js';

const pageSizeOptions = [10, 20, 30, 40, 50];

export default function Group() {
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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ sm: 1, md: 1, lg: 2, '2xl': 2 }}
        templateColumns="2fr 1fr"
        spacing={{ base: '20px', md: '20px', lg: '20px', '2xl': '20px' }}
      >
        <Box>
          <ListGroup
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

        <Box>
          <CreateGroup setIsSuccess={setIsSuccess} />
        </Box>
      </SimpleGrid>
    </Box>
  );
}
