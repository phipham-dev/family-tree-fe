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

export default function EditGroup({ selectedDoc, setSelectedDoc, isOpen, onClose, setIsUpdateSuccess }) {
  const [updatedDoc, setUpdatedDoc] = useState(selectedDoc);

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

    setUpdatedDoc({
      ...updatedDoc,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUpdatedDoc({
      ...updatedDoc,
      [name]: checked,
    });
  };

  const handleUpdateSave = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        if (
          selectedDoc.name !== updatedDoc.name ||
          selectedDoc.description !== updatedDoc.description ||
          selectedDoc.activated !== updatedDoc.activated
        ) {
          await axiosHelper.be1.patch(`${UPDATE_PATH}/${updatedDoc._id}`, updatedDoc);
          setSelectedDoc(null);
          setUpdatedDoc({});
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
    setSelectedDoc(null);
    setUpdatedDoc({});
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
                value={updatedDoc.name}
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
                value={updatedDoc.code}
                isDisabled={true}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                name="description"
                value={updatedDoc.description}
                maxLength={1000}
                onChange={handleInputChange}
              />
              <Text
                fontSize="sm"
                color="gray.500"
              >
                {updatedDoc.description.length}/1000 kí tự
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
                isChecked={updatedDoc.activated}
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
