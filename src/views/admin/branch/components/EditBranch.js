import axiosHelper from 'helpers/axios.helper.js';
import { showSuccessAlert, showWarningAlert, showErrorAlert } from 'helpers/response.helper.js';
import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  FormControl,
  FormLabel,
  Checkbox,
  Button,
  Text,
  Textarea,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import { UPDATE_PATH } from '../variables/path.js';

const ERROR_FONTSIZE = { base: 'xs', sm: 'xs', md: 'xs', lg: 'sm', xl: 'sm' };

export default function EditBranch({ selectedBranch, setSelectedBranch, isOpen, onClose, setIsUpdateSuccess }) {
  const [updatedBranch, setUpdatedBranch] = useState(selectedBranch);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    e.preventDefault();
    const newErrors = {};
    const { name, value } = e.target;

    if (name === 'name') {
      if (!value) {
        newErrors[name] = 'Tên là bắt buộc';
      } else if (value.length < 5 || value.length > 20) {
        newErrors[name] = 'Tên phải nhiều hơn 5 và nhỏ hơn 20 kí tự';
      }
    }

    if (name === 'description') {
      if (value.length > 1000) {
        newErrors[name] = 'Mô tả không được quá 1000 kí tự';
      }
    }

    setErrors(newErrors);

    setUpdatedBranch({
      ...updatedBranch,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUpdatedBranch({
      ...updatedBranch,
      [name]: checked,
    });
  };

  const handleUpdateSave = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        if (
          selectedBranch.name !== updatedBranch.name ||
          selectedBranch.description !== updatedBranch.description ||
          selectedBranch.activated !== updatedBranch.activated
        ) {
          await axiosHelper.be1.patch(`${UPDATE_PATH}/${updatedBranch._id}`, updatedBranch);
          setSelectedBranch(null);
          setUpdatedBranch({});
          setIsUpdateSuccess(true);
          onClose();
          showSuccessAlert('Cập nhật thành công');
        } else {
          showWarningAlert('Không có gì thay đổi, vui lòng kiểm tra lại hoặc hủy bỏ chỉnh sửa');
        }
      } else {
        return false;
      }
    } catch (error) {
      showErrorAlert(error);
      setIsUpdateSuccess(false);
    }
  };

  const handleUpdateClose = () => {
    setSelectedBranch(null);
    setUpdatedBranch({});
    onClose();
  };

  return (
    <Card>
      <Modal
        isOpen={isOpen}
        onClose={handleUpdateClose}
      >
        <ModalOverlay
          zIndex="modal"
          onClick={handleUpdateClose}
        />
        <ModalContent>
          <ModalHeader>Chỉnh sửa</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>
                Tên{' '}
                <Text
                  as="span"
                  color="red.500"
                >
                  *
                </Text>
              </FormLabel>
              <Input
                name="name"
                value={updatedBranch.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <Text
                  pt={1}
                  color="red.400"
                  fontSize={{ ...ERROR_FONTSIZE }}
                >
                  {errors.name}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Code</FormLabel>
              <Input
                name="code"
                value={updatedBranch.code}
                isDisabled={true}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                name="description"
                value={updatedBranch.description}
                maxLength={1000}
                onChange={handleInputChange}
              />
              <Text
                fontSize="sm"
                color="gray.500"
              >
                {updatedBranch.description.length}/1000 kí tự
              </Text>
              {errors.description && (
                <Text
                  pt={1}
                  color="red.400"
                  fontSize={{ ...ERROR_FONTSIZE }}
                >
                  {errors.description}
                </Text>
              )}
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Trạng thái kích hoạt / tạm dừng</FormLabel>
              <Checkbox
                name="activated"
                isChecked={updatedBranch.activated}
                onChange={handleCheckboxChange}
              />
            </FormControl>
            {/* Add more form fields as needed */}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleUpdateSave}
            >
              Cập nhật
            </Button>
            <Button
              variant="ghost"
              onClick={handleUpdateClose}
            >
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
