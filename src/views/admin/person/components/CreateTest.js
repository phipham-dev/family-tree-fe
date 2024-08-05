import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Box,
  Text,
} from '@chakra-ui/react';

// Fake user data
const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
];

function CreateTest() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    closeModal();
  };

  const handleDeleteUser = () => {
    setSelectedUser(null);
  };

  return (
    <Box p={5}>
      {!selectedUser ? (
        <Button
          colorScheme="teal"
          onClick={openModal}
        >
          Chọn User
        </Button>
      ) : (
        <Box>
          <Text>User đã chọn: {selectedUser.name}</Text>
          <Button
            colorScheme="red"
            mt={2}
            onClick={handleDeleteUser}
          >
            Xóa User
          </Button>
        </Box>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chọn một User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  borderWidth={1}
                  borderRadius="md"
                >
                  <Text>{user.name}</Text>
                  <Button
                    colorScheme="teal"
                    onClick={() => handleSelectUser(user)}
                  >
                    Chọn
                  </Button>
                </ListItem>
              ))}
            </List>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={closeModal}
            >
              Đóng
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CreateTest;
