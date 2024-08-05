import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import SearchPerson from './SearchPerson.js';

function PopupSearchPerson({ isOpen, onClose, handleChoose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose(!isOpen)}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width="60vw"
        maxWidth="60vw"
        maxHeight="auto"
      >
        <ModalHeader>Tìm kiếm theo CMND/Tên/Họ và tên</ModalHeader>
        <ModalCloseButton onClick={() => onClose(!isOpen)} />
        <ModalBody
          maxWidth="auto"
          maxHeight="auto"
        >
          <SearchPerson handleChoose={handleChoose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PopupSearchPerson;
