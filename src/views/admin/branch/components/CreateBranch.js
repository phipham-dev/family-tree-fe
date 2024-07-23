import React, { useState } from 'react';
import lodash from 'lodash';
import {
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  Text,
  Flex,
  useColorModeValue,
  Box,
  Spinner,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import axiosHelper from 'helpers/axios.helper.js';
import { showErrorAlert } from 'helpers/response.helper.js';
import { showSuccessAlert } from 'helpers/response.helper.js';
import { CREATE_PATH } from '../variables/path.js';
import { LIST_PATH as GROUP_LIST_PATH } from 'views/admin/group/variables/path.js';

const CreateBranch = ({ setIsSuccess }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const submitData = async () => {
    try {
      await axiosHelper.be1.post(CREATE_PATH, {
        name: name,
        group: selectedGroup,
        description: description,
      });

      setName('');
      setDescription('');
      setSelectedGroup('');
      showSuccessAlert('');
      setIsSuccess(true);
    } catch (error) {
      showErrorAlert(error, null);
      setIsSuccess(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name) {
      newErrors.name = 'Tên là bắt buộc';
    } else if (name.length < 5 || name.length > 20) {
      newErrors.name = 'Tên phải nhiều hơn 5 và nhỏ hơn 20 kí tự';
    }

    if (!selectedGroup) {
      newErrors.group = 'Phải chọn phái';
    }

    if (description.length > 1000) {
      newErrors.description = 'Mô tả không được quá 1000 kí tự';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      submitData();
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const result = await axiosHelper.be1.get(GROUP_LIST_PATH);
      const data = lodash.get(result, 'data.metadata.data', []);
      if (!lodash.isEmpty(data)) {
        setGroups(data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    fetchGroups();
  };

  const handleChange = (event) => {
    setSelectedGroup(event.target.value);
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Card>
      <Flex
        // px="25px"
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
          Thêm mới
        </Text>
      </Flex>

      <form onSubmit={handleSubmit}>
        {/* Tên */}
        <FormControl
          isInvalid={errors.name}
          mb={4}
        >
          <FormLabel>
            <Text
              fontSize={{ sm: '12px', lg: '15px' }}
              borderColor={borderColor}
              color="gray.400"
            >
              Tên{' '}
              <Text
                as="span"
                color="red.500"
              >
                *
              </Text>
            </Text>
          </FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
        </FormControl>

        {/* Phái */}
        <FormControl
          isInvalid={errors.group}
          mb={4}
        >
          <FormLabel>
            <Text
              fontSize={{ sm: '12px', lg: '15px' }}
              borderColor={borderColor}
              color="gray.400"
            >
              Phái{' '}
              <Text
                as="span"
                color="red.500"
              >
                *
              </Text>
            </Text>
          </FormLabel>
          <Select
            placeholder="Chọn phái"
            onFocus={handleOpen}
            onChange={handleChange}
            value={selectedGroup}
          >
            {loading ? (
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
          {errors.group && <FormErrorMessage>{errors.group}</FormErrorMessage>}
        </FormControl>

        {/* Mô tả */}
        <FormControl
          isInvalid={errors.description}
          mb={4}
        >
          <FormLabel
            fontSize={{ sm: '12px', lg: '15px' }}
            borderColor={borderColor}
            color="gray.400"
          >
            Mô tả
          </FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />
          <Text
            fontSize="sm"
            color="gray.500"
          >
            {description.length}/1000 kí tự
          </Text>
          {errors.description && <FormErrorMessage>{errors.description}</FormErrorMessage>}
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
        >
          Đăng ký
        </Button>
      </form>
    </Card>
  );
};

export default CreateBranch;
