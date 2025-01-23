import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import SearchPerson from './SearchPerson.js';

function SearchPersonPopup({ isOpen, onClose, onSelected }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        width="60vw"
        maxWidth="60vw"
        maxHeight="auto"
      >
        <ModalHeader>Tìm kiếm theo CMND/Tên/Họ và tên</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          maxWidth="auto"
          maxHeight="auto"
        >
          <SearchPerson onSelected={onSelected} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SearchPersonPopup;
