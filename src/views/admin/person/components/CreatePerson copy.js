import React, { useState } from 'react';
import {
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
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import axiosHelper from 'helpers/axios.helper.js';
import { showErrorAlert } from 'helpers/response.helper.js';
import { showSuccessAlert } from 'helpers/response.helper.js';
import { CREATE_PATH } from '../variables/path.js';

const CreatePerson = ({ setIsSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const submitData = async () => {
    try {
      await axiosHelper.be1.post(CREATE_PATH, {
        name: name,
        description: description,
      });

      setName('');
      setDescription('');
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

    if (description.length > 1000) {
      newErrors.description = 'Mô tả không được quá 1000 kí tự';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      submitData();
    }
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box pt={{ base: '120px', md: '70px', xl: '70px' }}>
      <Card>
        <form onSubmit={handleSubmit}>
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
    </Box>
  );
};

export default CreatePerson;
