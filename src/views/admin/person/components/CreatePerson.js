import React, { useState } from 'react';
import lodash from 'lodash';
import Swal from 'sweetalert2';

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
  VStack,
  Select,
  HStack,
  Icon,
  Modal,
} from '@chakra-ui/react';
import InputMask from 'react-input-mask';
import Card from 'components/card/Card.js';
import axiosHelper from 'helpers/axios.helper.js';
import { showErrorAlert } from 'helpers/response.helper.js';
import { showSuccessAlert } from 'helpers/response.helper.js';
import { CREATE_PATH } from '../variables/path.js';
import { Provinces } from 'constants/model.constant.js';
import { Gender } from 'constants/model.constant.js';
import { GenderToVN } from 'constants/model.constant.js';
import { NATIONALITY_DEFAULT } from 'constants/model.constant.js';
import { Status } from 'constants/model.constant.js';
import { StatusToVN } from 'constants/model.constant.js';
import { MdControlPoint } from 'react-icons/md';
import MiniInfoPerson from './common/MiniInfoPerson.js';
import PopupSearchPerson from './common/PopupSearchPerson.js';

const CreatePerson = ({ setIsSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cic, setCic] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [nationality, setNationality] = useState('Việt Nam');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [status, setStatus] = useState('');
  const [spouses, setSpouses] = useState([]);
  const [parents, setParents] = useState([]);
  const [childrens, setChildrens] = useState([]);

  const [selectedFather, setSelectedFather] = useState({});
  const [showFatherPopup, setShowFatherPopup] = useState(false);

  const [selectedMother, setSelectedMother] = useState({});
  const [showMotherPopup, setShowMotherPopup] = useState(false);

  const [showSpousesPopup, setShowSpousesPopup] = useState(false);
  const [showChildrenPopup, setShowChildrenPopup] = useState(false);

  const [errors, setErrors] = useState({});

  const submitData = async () => {
    try {
      const data = {
        firstName,
        middleName,
        lastName,
        dateOfBirth,
        cic,
        gender,
        placeOfBirth,
        nationality,
        address,
        phoneNumber,
        emailAddress,
        status,
        maritalStatus,
        father: selectedFather,
        mother: selectedMother,
        spouses,
        childrens,
      };

      await axiosHelper.be1.post(CREATE_PATH, data);

      resetForm();
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

    // if (!name) {
    //   newErrors.name = 'Tên là bắt buộc';
    // } else if (name.length < 5 || name.length > 20) {
    //   newErrors.name = 'Tên phải nhiều hơn 5 và nhỏ hơn 20 kí tự';
    // }

    // if (description.length > 1000) {
    //   newErrors.description = 'Mô tả không được quá 1000 kí tự';
    // }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      submitData();
    }
  };

  /**
   * Handler
   */

  const handleChooseFather = (person = null) => {
    if (person) {
      const addSuccess = addToParents(person);
      if (addSuccess) {
        setSelectedFather(person);
      }
    } else {
      setSelectedFather({});
    }

    setShowFatherPopup(false);
  };

  const handleChooseMother = (person = null) => {
    if (person) {
      const addSuccess = addToParents(person);
      if (addSuccess) {
        setSelectedMother(person);
      }
    } else {
      setSelectedMother({});
    }

    setShowMotherPopup(false);
  };

  const handleChooseSpouses = (person) => {
    if (person) {
      const addSuccess = addToSpouses(person);
      if (addSuccess) {
        setShowSpousesPopup(false);
      }
    }
  };

  const handleChooseChildrens = (person) => {
    if (person) {
      const addSuccess = addToChildrens(person);
      if (addSuccess) {
        setShowChildrenPopup(false);
      }
    }
  };

  /**
   * Add/Remove
   */
  const addToParents = (person) => {
    if (hasInSpouses(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Cha/Mẹ',
        text: `Thành viên này đã tồn tại ở mục Vợ/Chồng`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }

    if (hasInChildrens(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Cha/Mẹ',
        text: `Thành viên này đã tồn tại ở mục Con Cái`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }

    const found = lodash.find(parents, (v) => v._id === person._id);
    if (lodash.isEmpty(found)) {
      setParents([...parents, person]);
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Cha/Mẹ',
        text: `Vui lòng thử lại, thông tin lựa chọn trùng lặp`,
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
  };

  const addToSpouses = (person) => {
    if (hasInParents(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Vợ/Chồng',
        text: `Thành viên này đã tồn tại ở mục Cha/Mẹ`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }

    if (hasInChildrens(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Vợ/Chồng',
        text: `Thành viên này đã tồn tại ở mục Con Cái`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }

    const found = lodash.find(spouses, (v) => v._id === person._id);
    if (lodash.isEmpty(found)) {
      setSpouses([...spouses, person]);
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Vợ/Chồng',
        text: `Vui lòng thử lại, thông tin lựa chọn trùng lặp`,
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
  };

  const addToChildrens = (person) => {
    if (hasInParents(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Con',
        text: `Thành viên này đã tồn tại ở mục Cha/Mẹ`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }

    if (hasInSpouses(person)) {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Cha/Mẹ',
        text: `Thành viên này đã tồn tại ở mục Vợ/Chồng`,
        showConfirmButton: false,
        timer: 1500,
      });

      return false;
    }
    const found = lodash.find(childrens, (v) => v._id === person._id);
    if (lodash.isEmpty(found)) {
      setChildrens([...childrens, person]);
      return true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thêm Con',
        text: `Vui lòng thử lại, thông tin lựa chọn trùng lặp`,
        showConfirmButton: false,
        timer: 1500,
      });
      return false;
    }
  };

  const removeFromParents = (person) => {
    if (!lodash.isEmpty(person)) {
      if (selectedFather._id === person._id) {
        setSelectedFather({});
      }

      if (selectedMother._id === person._id) {
        setSelectedMother({});
      }

      if (!lodash.isEmpty(parents)) {
        const newParents = parents.filter((v) => v._id !== person._id);
        setParents(newParents);
      }
    }
  };

  const removeFromSpouses = (person) => {
    if (!lodash.isEmpty(person) && !lodash.isEmpty(spouses)) {
      const newSpouses = spouses.filter((v) => v._id !== person._id);
      setSpouses([...newSpouses]);
    }
  };

  const removeFromChildrens = (person) => {
    if (!lodash.isEmpty(person) && !lodash.isEmpty(childrens)) {
      const newChildrens = childrens.filter((v) => v._id !== person._id);
      setChildrens([...newChildrens]);
    }
  };

  /**
   * Check
   */
  const hasInParents = (person) => {
    return !lodash.isEmpty(lodash.find(parents, (v) => v._id === person._id)) ? true : false;
  };

  const hasInSpouses = (person) => {
    return !lodash.isEmpty(lodash.find(spouses, (v) => v._id === person._id)) ? true : false;
  };

  const hasInChildrens = (person) => {
    return !lodash.isEmpty(lodash.find(childrens, (v) => v._id === person._id)) ? true : false;
  };

  const resetForm = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setDateOfBirth('');
    setCic('');
    setGender('');
    setPlaceOfBirth('');
    setNationality('');
    setAddress('');
    setPhoneNumber('');
    setEmailAddress('');
    setStatus('');
    setMaritalStatus('');
    setSelectedFather({});
    setSelectedMother({});
    setSpouses([]);
    setChildrens([]);
    setShowFatherPopup(false);
    setShowMotherPopup(false);
    setShowSpousesPopup(false);
    setShowChildrenPopup(false);
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  return (
    <Box pt={{ base: '120px', md: '70px', xl: '70px' }}>
      <Card>
        <form onSubmit={handleSubmit}>
          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            {/* Họ */}
            <FormControl
              isRequired
              mr={4}
            >
              <FormLabel htmlFor="firstName">Họ</FormLabel>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            {/* Tên đệm */}
            <FormControl
              isRequired
              mr={4}
            >
              <FormLabel htmlFor="middleName">Tên đệm</FormLabel>
              <Input
                id="middleName"
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </FormControl>

            {/* Tên */}
            <FormControl isRequired>
              <FormLabel htmlFor="lastName">Tên</FormLabel>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="dateOfBirth">Năm sinh</FormLabel>
              <InputMask
                mask="99/99/9999"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              >
                {() => (
                  <Input
                    id="dateOfBirth"
                    placeholder="Ngày/Tháng/Năm"
                    // You can add any other necessary Chakra UI props here
                  />
                )}
              </InputMask>
            </FormControl>

            <FormControl
              isRequired
              mr={4}
            >
              <FormLabel htmlFor="cic">CCCD/CMND</FormLabel>
              <Input
                id="cic"
                type="number"
                value={cic}
                onChange={(e) => setCic(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="gender">Giới tính</FormLabel>
              <Select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={Gender.MALE}>{GenderToVN.MALE}</option>
                <option value={Gender.FEMALE}>{GenderToVN.FEMALE}</option>
              </Select>
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="placeOfBirth">Nơi sinh</FormLabel>
              <Select
                id="placeOfBirth"
                value={placeOfBirth}
                onChange={(e) => setPlaceOfBirth(e.target.value)}
              >
                {Provinces.map((v) => {
                  return <option value={v}>{v}</option>;
                })}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="nationality">Quốc gia</FormLabel>
              <Select
                id="nationality"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              >
                <option value={NATIONALITY_DEFAULT}>{NATIONALITY_DEFAULT}</option>
                <option value="Nước Ngoài">Nước Ngoài</option>
              </Select>
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl>
              <FormLabel htmlFor="address">Địa chỉ</FormLabel>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
              <Input
                id="phoneNumber"
                type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="emailAddress">Email</FormLabel>
              <Input
                id="emailAddress"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="status">Tình trạng sức khỏe</FormLabel>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
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
                <option value="UNKNOWN">Chưa rõ</option>
                <option value="SINGLE">Độc thân</option>
                <option value="MARRIED">Đã kết hôn</option>
                <option value="DIVORCED">Ly hôn</option>
              </Select>
            </FormControl>
          </Flex>

          {/* Cha - Mẹ */}
          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="father">Cha</FormLabel>
              {selectedFather.fullName ? (
                <MiniInfoPerson
                  person={selectedFather}
                  setPerson={handleChooseFather}
                  removePerson={removeFromParents}
                ></MiniInfoPerson>
              ) : (
                <div>
                  <Button
                    variant="warning"
                    onClick={() => setShowFatherPopup(true)}
                    leftIcon={
                      <Icon
                        as={MdControlPoint}
                        boxSize={7}
                        color="blue.400"
                      />
                    }
                  ></Button>
                  <PopupSearchPerson
                    isOpen={showFatherPopup}
                    onClose={setShowFatherPopup}
                    handleChoose={handleChooseFather}
                  />
                </div>
              )}
            </FormControl>

            <FormControl mr={4}>
              <FormLabel htmlFor="mother">Mẹ</FormLabel>
              {selectedMother.fullName ? (
                <MiniInfoPerson
                  person={selectedMother}
                  setPerson={handleChooseMother}
                  removePerson={removeFromParents}
                ></MiniInfoPerson>
              ) : (
                <div>
                  <Button
                    variant="warning"
                    onClick={() => setShowMotherPopup(true)}
                    leftIcon={
                      <Icon
                        as={MdControlPoint}
                        boxSize={7}
                        color="blue.400"
                      />
                    }
                  ></Button>
                  <PopupSearchPerson
                    isOpen={showMotherPopup}
                    onClose={setShowMotherPopup}
                    handleChoose={handleChooseMother}
                  />
                </div>
              )}
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl>
              <FormLabel htmlFor="spouse">Vợ/Chồng</FormLabel>
              <Button
                variant="warning"
                onClick={() => setShowSpousesPopup(true)}
              >
                Thêm Vợ/Chồng
              </Button>
            </FormControl>
          </Flex>

          <Flex
            direction="row"
            align="center"
            justify="space-between"
            mb={4}
          >
            <FormControl>
              <FormLabel htmlFor="children">Con</FormLabel>
              <Button
                variant="warning"
                onClick={() => setShowChildrenPopup(true)}
              >
                Thêm Con
              </Button>
            </FormControl>
          </Flex>

          <Button
            colorScheme="teal"
            type="submit"
          >
            Add
          </Button>
          <Button colorScheme="gray">Cancel</Button>
        </form>
      </Card>
    </Box>
  );
};

export default CreatePerson;
