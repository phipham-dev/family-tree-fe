import React, { useEffect, useState } from 'react';
import lodash from 'lodash';

import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Box,
  Select,
  Icon,
  Divider,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Text,
  Spinner,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import axiosHelper from 'helpers/axios.helper.js';
import { showErrorAlert } from 'helpers/response.helper.js';
import { showSuccessAlert } from 'helpers/response.helper.js';
import { CREATE_PATH } from '../variables/path.js';
import { LIST_PATH as GROUP_LIST_PATH } from 'views/admin/group/variables/path.js';
import { LIST_PATH as BRANCH_LIST_PATH } from 'views/admin/branch/variables/path.js';
import {
  Status,
  StatusToVN,
  Gender,
  GenderToVN,
  NATIONALITY_DEFAULT,
  Provinces,
  MaritalStatus as MaritalStatusEnum,
  MaritalStatusToVN,
} from 'constants/model.constant.js';
import {} from 'constants/model.constant.js';
import { MdControlPoint } from 'react-icons/md';
import MiniInfoPerson from './common/MiniInfoPerson.js';
import SearchPersonPopup from './common/SearchPersonPopup.js';
import { showCustomErrorAlert } from 'helpers/response.helper.js';
import randomCic from 'utils/randomCic.js';
import CustomDatePicker from 'components/date/CustomDatePicker.js';

const CIC_REGEX = /^[0-9]{9,12}$/;
const GEN_NUM_REGEX = /^[1-9]\d*$|^0\d+$/;
const EMAIL_REGEX = /^(?=.*\b(gmail|hotmail)\b).*/;
const PHONE_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

const CreatePerson = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [differentName, setDifferentName] = useState('');
  const [cic, setCic] = useState('');
  const [gender, setGender] = useState(Gender.MALE);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [group, setGroup] = useState('');
  const [branch, setBranch] = useState('');
  const [groups, setGroups] = useState([]);
  const [branches, setBranches] = useState([]);
  const [genNum, setGenNum] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState(Provinces[0]);
  const [nationality, setNationality] = useState(NATIONALITY_DEFAULT);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [maritalStatus, setMaritalStatus] = useState(MaritalStatusEnum.UNKNOWN);
  const [status, setStatus] = useState(Status.UNKNOWN);
  const [spouses, setSpouses] = useState([]);
  const [children, setChildren] = useState([]);
  const [stepFathers, setStepFathers] = useState([]);
  const [stepMothers, setStepMothers] = useState([]);

  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const [isBranchLoading, setIsBranchLoading] = useState(false);

  const [selectedFather, setSelectedFather] = useState({});
  const [isFatherSearchOpen, setIsFatherSearchOpen] = useState(false);
  const openFatherSearch = () => setIsFatherSearchOpen(true);
  const closeFatherSearch = () => setIsFatherSearchOpen(false);

  const [isStepFathersSearchOpen, setIsStepFathersSearchOpen] = useState(false);
  const openStepFathersSearch = () => setIsStepFathersSearchOpen(true);
  const closeStepFathersSearch = () => setIsStepFathersSearchOpen(false);

  const [selectedMother, setSelectedMother] = useState({});
  const [isMotherSearchOpen, setIsMotherSearchOpen] = useState(false);
  const openMotherSearch = () => setIsMotherSearchOpen(true);
  const closeMotherSearch = () => setIsMotherSearchOpen(false);

  const [isStepMothersSearchOpen, setIsStepMothersSearchOpen] = useState(false);
  const openStepMothersSearch = () => setIsStepMothersSearchOpen(true);
  const closeStepMothersSearch = () => setIsStepMothersSearchOpen(false);

  const [isSpouseSearchOpen, setIsSpouseSearchOpen] = useState(false);
  const openSpouseSearch = () => setIsSpouseSearchOpen(true);
  const closeSpouseSearch = () => setIsSpouseSearchOpen(false);

  const [isChildrenSearchOpen, setIsChildrenSearchOpen] = useState(false);
  const openChildrenSearch = () => setIsChildrenSearchOpen(true);
  const closeChildrenSearch = () => setIsChildrenSearchOpen(false);

  const [errors, setErrors] = useState({});

  const submitData = async () => {
    try {
      const data = {
        firstName,
        middleName,
        lastName,
        differentName,
        cic,
        group,
        branch,
        gender,
        dateOfBirth,
        placeOfBirth,
        nationality,
        address,
        phoneNumber,
        emailAddress,
        status,
        maritalStatus,
        genNum,
        father: lodash.get(selectedFather, '_id', null),
        mother: lodash.get(selectedMother, '_id', null),
        spouses: lodash.map(spouses, '_id', []),
        children: lodash.map(children, '_id', []),
        stepFathers: lodash.map(stepFathers, '_id', []),
        stepMothers: lodash.map(stepMothers, '_id', []),
      };

      await axiosHelper.be1.post(CREATE_PATH, data);
      resetForm();
      showSuccessAlert('');
    } catch (error) {
      showErrorAlert(error, null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {
      firstName: validateEmptyField(firstName, 'Họ'),
      lastName: validateEmptyField(lastName, 'Tên'),
      cic: validateEmptyField(cic, 'CMND/CCCD'),
    };

    if (!lodash.isEmpty(errors)) {
      newErrors = Object.assign(errors, newErrors);
    }
    setErrors(newErrors);
    const allValuesEmpty = lodash.every(newErrors, lodash.isEmpty);
    if (allValuesEmpty) {
      submitData();
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  /** Groups */
  const fetchGroups = async () => {
    try {
      setIsGroupLoading(true);
      const result = await axiosHelper.be1.get(GROUP_LIST_PATH);
      const data = lodash.get(result, 'data.metadata.data', []);
      if (!lodash.isEmpty(data)) {
        setGroups(data);
      }
    } catch (error) {
      setGroups([]);
    } finally {
      setIsGroupLoading(false);
    }
  };

  const handleGroupOpen = () => {
    fetchGroups();
  };

  const handleGroupChange = (event) => {
    setGroup(event.target.value);
    setBranch('');
  };

  /** Branchs */
  const fetchBranches = async () => {
    try {
      if (group) {
        setIsBranchLoading(true);
        const result = await axiosHelper.be1.get(`${BRANCH_LIST_PATH}?g=${group}`);
        const data = lodash.get(result, 'data.metadata.data', []);
        if (!lodash.isEmpty(data)) {
          setBranches(data);
        }
      } else {
        setBranches([]);
      }
    } catch (error) {
      setBranches([]);
    } finally {
      setIsBranchLoading(false);
    }
  };

  const handleBranchOpen = () => {
    fetchBranches();
  };

  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };

  /**
   * Handler
   */
  // Father
  const onSelectedFather = (person = null) => {
    if (!isValidPerson(person, 'Thêm Cha', 'father')) {
      setSelectedFather(person);
    } else {
      setSelectedFather({});
    }

    closeFatherSearch();
  };

  // Mother
  const onSelectedMother = (person = null) => {
    if (!isValidPerson(person, 'Thêm Mẹ', 'mother')) {
      setSelectedMother(person);
    } else {
      setSelectedMother({});
    }

    closeMotherSearch();
  };

  // Spouses
  const onSelectedSpouses = (person) => {
    if (!isValidPerson(person, 'Thêm Vợ/Chồng', 'spouse')) {
      setSpouses((prev) => [...prev, person]);
    }

    closeSpouseSearch();
  };

  // Children
  const onSelectedChildren = (person) => {
    if (!isValidPerson(person, 'Thêm Con Cái', 'children')) {
      setChildren((prev) => [...prev, person]);
    }

    closeChildrenSearch();
  };

  // Step Father
  const onSelectedStepFathers = (person) => {
    if (!isValidPerson(person, 'Thêm Cha Dượng', 'stepFather')) {
      setStepFathers((prev) => [...prev, person]);
    }

    closeStepFathersSearch();
  };

  // Step Mother
  const onSelectedStepMothers = (person) => {
    if (!isValidPerson(person, 'Thêm Mẹ Kế', 'stepMother')) {
      setStepMothers((prev) => [...prev, person]);
    }

    closeStepMothersSearch();
  };

  // Input change
  const onInputChange = (field, fieldName, value) => {
    let setField;
    let min;
    let max;
    let regex;
    let msg = '';
    switch (field) {
      case 'firstName':
        setField = setFirstName;
        min = 1;
        max = 20;
        msg = validateStringField(fieldName, value, min, max);
        break;

      case 'middleName':
        setField = setMiddleName;
        max = 20;
        msg = validateStringField(fieldName, value, min, max);
        break;

      case 'lastName':
        setField = setLastName;
        min = 1;
        max = 20;
        msg = validateStringField(fieldName, value, min, max);
        break;

      case 'differentName':
        setField = setDifferentName;
        min = 1;
        max = 20;
        msg = validateStringField(fieldName, value, min, max);
        break;

      case 'cic':
        setField = setCic;
        regex = CIC_REGEX;
        msg = validateRegex(regex, fieldName, value, ', giá trị phải từ 9 đến 12 số');
        break;

      case 'genNum':
        setField = setGenNum;
        regex = GEN_NUM_REGEX;
        msg = validateRegex(regex, fieldName, value, ', giá trị phải từ 1');
        break;

      case 'phoneNumber':
        setField = setPhoneNumber;
        regex = PHONE_REGEX;
        msg = validateRegex(regex, fieldName, value);
        break;

      case 'emailAddress':
        setField = setEmailAddress;
        regex = EMAIL_REGEX;
        msg = validateRegex(regex, fieldName, value);
        break;

      default:
        return;
    }

    setField(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: msg,
    }));
  };

  /**
   * Validation
   */
  const isValidPerson = (person, title, role = null) => {
    const options = {
      father: 'Cha',
      mother: 'Mẹ',
      spouse: 'Vợ/Chồng',
      children: 'Con Cái',
      stepFather: 'Cha Dượng',
      stepMother: 'Mẹ Kế',
    };

    const funcOpts = {
      father: isFather(person),
      mother: isMother(person),
      spouse: hasInSpouses(person),
      children: hasInChildren(person),
      stepFather: hasInStepFathers(person),
      stepMother: hasInStepMothers(person),
    };

    if (role) {
      return lodash.some(options, (v, k) => {
        if (k !== role) {
          if (funcOpts[k]) {
            showCustomErrorAlert(title, `Thành viên này đang được chọn làm ${v}`);
            return true;
          }
        }

        return false;
      });
    }

    return false;
  };

  /**
   * Remove
   */
  const removeFather = () => {
    setSelectedFather({});
  };

  const removeMother = () => {
    setSelectedMother({});
  };

  const removeFromSpouses = (person) => {
    setSpouses(spouses.filter((p) => p._id !== person._id));
  };

  const removeFromChildren = (person) => {
    setChildren(children.filter((p) => p._id !== person._id));
  };

  const removeFromStepFathers = (person) => {
    setStepFathers(stepFathers.filter((p) => p._id !== person._id));
  };

  const removeFromStepMothers = (person) => {
    setStepMothers(stepMothers.filter((p) => p._id !== person._id));
  };

  /**
   * Check
   */
  const isFather = (person) => {
    return selectedFather._id === person._id;
  };

  const isMother = (person) => {
    return selectedMother._id === person._id;
  };

  const hasInSpouses = (person) => {
    return !lodash.isEmpty(lodash.find(spouses, (v) => v._id === person._id)) ? true : false;
  };

  const hasInChildren = (person) => {
    return !lodash.isEmpty(lodash.find(children, (v) => v._id === person._id)) ? true : false;
  };

  const hasInStepFathers = (person) => {
    return !lodash.isEmpty(lodash.find(stepFathers, (v) => v._id === person._id)) ? true : false;
  };

  const hasInStepMothers = (person) => {
    return !lodash.isEmpty(lodash.find(stepMothers, (v) => v._id === person._id)) ? true : false;
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setDifferentName('');
    setDateOfBirth('');
    setCic('');
    setGroup('');
    setBranch('');
    setGenNum('');
    setPhoneNumber('');
    setEmailAddress('');
    setGender(Gender.MALE);
    setPlaceOfBirth(Provinces[0]);
    setNationality(NATIONALITY_DEFAULT);
    setAddress('');
    setStatus(Status.UNKNOWN);
    setMaritalStatus(MaritalStatusEnum.UNKNOWN);
    setSelectedFather({});
    setSelectedMother({});
    setSpouses([]);
    setChildren([]);
    setStepFathers([]);
    setStepMothers([]);
    setIsFatherSearchOpen(false);
    setIsMotherSearchOpen(false);
    setIsSpouseSearchOpen(false);
    setIsChildrenSearchOpen(false);
    setIsStepFathersSearchOpen(false);
    setIsStepMothersSearchOpen(false);
  };

  /**
   * Utils
   */
  const onRandomCic = () => {
    const randomNum = randomCic();
    onInputChange('cic', 'CCCD/CMND', randomNum);
  };

  const validateEmptyField = (field, fieldName) => {
    return field === '' ? `Vui lòng nhập ${fieldName}` : '';
  };

  const validateStringField = (field, value, min, max) => {
    if (lodash.isNumber(min) && (value.length < min || value.length > max)) {
      return `${field} phải có ít nhất ${min} ký tự và nhiều nhất ${max} kí tự`;
    }

    if (lodash.isNumber(max) && value.length > max) {
      return `${field} không được phép quá ${max} kí tự`;
    }
  };

  const validateRegex = (regex, field, value, extraMsg = '') => {
    return !regex.test(value) ? `${field} không hợp lệ${extraMsg}` : '';
  };

  return (
    <Box pt={{ base: '120px', md: '70px', xl: '70px' }}>
      <Card>
        <form onSubmit={handleSubmit}>
          <FormLabel
            fontWeight="bold"
            htmlFor="information"
            fontSize={20}
            color="blue.400"
          >
            Thông tin dòng tộc
          </FormLabel>
          <Divider mb={4} />
          {/* THÔNG TIN DÒNG TỘC */}
          {/* Phái - Chi - Đời */}
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {/* Phái */}
            <FormControl mr={4}>
              <FormLabel htmlFor="group">Phái</FormLabel>
              <Select
                placeholder="Chọn phái"
                onFocus={handleGroupOpen}
                onChange={handleGroupChange}
                value={group}
              >
                {isGroupLoading ? (
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
            </FormControl>

            {/* Chi */}
            <FormControl mr={4}>
              <FormLabel htmlFor="branch">Chi</FormLabel>
              <Select
                placeholder="Chọn chi"
                onFocus={handleBranchOpen}
                onChange={handleBranchChange}
                value={branch}
              >
                {isBranchLoading ? (
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
                  branches.map((branch) => (
                    <option
                      key={branch._id}
                      value={branch._id}
                    >
                      {branch.name}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Đời */}
            <FormControl isInvalid={!!errors?.genNum}>
              <FormLabel htmlFor="genNum">Đời</FormLabel>
              <Input
                id="genNum"
                placeholder="Đời thứ"
                type="number"
                value={genNum}
                onChange={(e) => onInputChange('genNum', 'Đời', e.target.value)}
              />
              <FormErrorMessage>{errors?.genNum}</FormErrorMessage>
            </FormControl>
          </Flex>

          {/* THÔNG TIN CÁ NHÂN */}
          <FormLabel
            fontWeight="bold"
            htmlFor="information"
            fontSize={20}
            mt={10}
            color="blue.400"
          >
            Thông tin cá nhân
          </FormLabel>
          <Divider mb={4} />
          {/* Họ - Đệm - Tên */}
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {/* Họ */}
            <FormControl
              isInvalid={!!errors?.firstName}
              mr={4}
            >
              <FormLabel htmlFor="firstName">
                Họ{' '}
                <Text
                  as="span"
                  color="red.500"
                >
                  *
                </Text>
              </FormLabel>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => onInputChange('firstName', 'Họ', e.target.value)}
              />
              <FormErrorMessage>{errors?.firstName}</FormErrorMessage>
            </FormControl>

            {/* Tên đệm */}
            <FormControl
              isInvalid={!!errors?.middleName}
              mr={4}
            >
              <FormLabel htmlFor="middleName">Tên đệm </FormLabel>
              <Input
                id="middleName"
                type="text"
                value={middleName}
                onChange={(e) => onInputChange('middleName', 'Tên đệm', e.target.value)}
              />
              <FormErrorMessage>{errors?.middleName}</FormErrorMessage>
            </FormControl>

            {/* Tên */}
            <FormControl
              isInvalid={!!errors?.lastName}
              mr={4}
            >
              <FormLabel htmlFor="lastName">
                Tên{' '}
                <Text
                  as="span"
                  color="red.500"
                >
                  *
                </Text>
              </FormLabel>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => onInputChange('lastName', 'Tên', e.target.value)}
              />
              <FormErrorMessage>{errors?.lastName}</FormErrorMessage>
            </FormControl>

            {/* Tên khác */}
            <FormControl isInvalid={!!errors?.differentName}>
              <FormLabel htmlFor="differentName">Tên khác </FormLabel>
              <Input
                id="differentName"
                type="text"
                value={differentName}
                onChange={(e) => setDifferentName(e.target.value)}
              />
              <FormErrorMessage>{errors?.differentName}</FormErrorMessage>
            </FormControl>
          </Flex>

          {/* Năm sinh - CMND - Giới tính */}
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            <FormControl mr={4}>
              <FormLabel htmlFor="dateOfBirth">Năm sinh</FormLabel>

              <CustomDatePicker
                selectedDate={dateOfBirth}
                onChange={(date) => setDateOfBirth(date)}
              />
            </FormControl>
            <FormControl
              isInvalid={!!errors?.cic}
              mr={4}
            >
              <FormLabel htmlFor="cic">
                CCCD/CMND{' '}
                <Text
                  as="span"
                  color="red.500"
                >
                  *
                </Text>
              </FormLabel>
              <InputGroup>
                <Input
                  id="cic"
                  type="number"
                  value={cic}
                  onChange={(e) => onInputChange('cic', 'CMND/CCCD', e.target.value)}
                />
                <InputRightElement width="auto">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={onRandomCic}
                  >
                    Ngẫu nhiên
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.cic}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.gender}>
              <FormLabel htmlFor="gender">
                Giới tính{' '}
                <Text
                  as="span"
                  color="red.500"
                >
                  *
                </Text>
              </FormLabel>
              <Select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value={Gender.MALE}>{GenderToVN.MALE}</option>
                <option value={Gender.FEMALE}>{GenderToVN.FEMALE}</option>
              </Select>
              <FormErrorMessage>{errors?.gender}</FormErrorMessage>
            </FormControl>
          </Flex>

          {/* Nơi sinh - Quốc gia */}
          <Flex
            direction="row"
            align="flex-start"
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
                {Provinces.map((v, k) => {
                  return (
                    <option
                      key={k}
                      value={v}
                    >
                      {v}
                    </option>
                  );
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

          {/* Địa chỉ */}
          <Flex
            direction="row"
            align="flex-start"
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

          {/* Số điện thoại - Email */}
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            <FormControl
              isInvalid={!!errors?.phoneNumber}
              mr={4}
            >
              <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
              <Input
                id="phoneNumber"
                type="number"
                value={phoneNumber}
                onChange={(e) => onInputChange('phoneNumber', 'Số điện thoại', e.target.value)}
              />
              <FormErrorMessage>{errors?.phoneNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors?.emailAddress}>
              <FormLabel htmlFor="emailAddress">Email</FormLabel>
              <Input
                id="emailAddress"
                type="email"
                value={emailAddress}
                onChange={(e) => onInputChange('emailAddress', 'Email', e.target.value)}
              />
              <FormErrorMessage>{errors?.emailAddress}</FormErrorMessage>
            </FormControl>
          </Flex>

          {/* Tình trạng sức khỏe - Hôn nhân */}
          <Flex
            direction="row"
            align="flex-start"
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
                <option value={MaritalStatusEnum.UNKNOWN}>{MaritalStatusToVN.UNKNOWN}</option>
                <option value={MaritalStatusEnum.SINGLE}>{MaritalStatusToVN.SINGLE}</option>
                <option value={MaritalStatusEnum.MARRIED}>{MaritalStatusToVN.MARRIED}</option>
                <option value={MaritalStatusEnum.DIVORCED}>{MaritalStatusToVN.DIVORCED}</option>
              </Select>
            </FormControl>
          </Flex>

          {/* THÔNG TIN THÂN NHÂN */}
          <FormLabel
            fontWeight="bold"
            htmlFor="information"
            fontSize={20}
            mt={10}
            color="blue.400"
          >
            Thông tin thân nhân
          </FormLabel>
          <Divider mb={4} />
          {/* Cha */}
          <FormLabel htmlFor="father">Cha</FormLabel>
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {selectedFather.fullName && (
              <MiniInfoPerson
                information={selectedFather}
                onSet={setSelectedFather}
                onRemove={removeFather}
              ></MiniInfoPerson>
            )}

            <FormControl mr={4}>
              {!selectedFather.fullName && (
                <Button
                  variant="warning"
                  onClick={openFatherSearch}
                  leftIcon={
                    <Icon
                      as={MdControlPoint}
                      boxSize={7}
                      color="blue.400"
                    />
                  }
                ></Button>
              )}

              <SearchPersonPopup
                isOpen={isFatherSearchOpen}
                onClose={closeFatherSearch}
                onSelected={onSelectedFather}
              />
            </FormControl>
          </Flex>
          {/* Mẹ */}
          <FormLabel htmlFor="mother">Mẹ</FormLabel>
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {selectedMother.fullName && (
              <MiniInfoPerson
                information={selectedMother}
                onSet={setSelectedMother}
                onRemove={removeMother}
              ></MiniInfoPerson>
            )}
            <FormControl mr={4}>
              {!selectedMother.fullName && (
                <Button
                  variant="warning"
                  onClick={openMotherSearch}
                  leftIcon={
                    <Icon
                      as={MdControlPoint}
                      boxSize={7}
                      color="blue.400"
                    />
                  }
                ></Button>
              )}

              <SearchPersonPopup
                isOpen={isMotherSearchOpen}
                onClose={setIsMotherSearchOpen}
                onSelected={onSelectedMother}
              />
            </FormControl>
          </Flex>

          {/* Vợ/Chồng */}

          {maritalStatus !== MaritalStatusEnum.SINGLE && (
            <>
              <FormLabel htmlFor="spouses">Vợ chồng</FormLabel>
              <Flex
                direction="row"
                align="flex-start"
                justify="space-between"
                mb={4}
              >
                {spouses.map((person) => (
                  <MiniInfoPerson
                    information={person}
                    onSet={null}
                    onRemove={removeFromSpouses}
                  ></MiniInfoPerson>
                ))}
                <FormControl>
                  <div>
                    <Button
                      variant="warning"
                      onClick={openSpouseSearch}
                      leftIcon={
                        <Icon
                          as={MdControlPoint}
                          boxSize={7}
                          color="blue.400"
                        />
                      }
                    ></Button>
                    <SearchPersonPopup
                      isOpen={isSpouseSearchOpen}
                      onClose={closeSpouseSearch}
                      onSelected={onSelectedSpouses}
                    />
                  </div>
                </FormControl>
              </Flex>
            </>
          )}

          {/* Con */}
          <FormLabel htmlFor="children">Con</FormLabel>
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {children.map((person) => (
              <MiniInfoPerson
                information={person}
                onSet={null}
                onRemove={removeFromChildren}
              ></MiniInfoPerson>
            ))}
            <FormControl>
              <div>
                <Button
                  variant="warning"
                  onClick={openChildrenSearch}
                  leftIcon={
                    <Icon
                      as={MdControlPoint}
                      boxSize={7}
                      color="blue.400"
                    />
                  }
                ></Button>
                <SearchPersonPopup
                  isOpen={isChildrenSearchOpen}
                  onClose={closeChildrenSearch}
                  onSelected={onSelectedChildren}
                />
              </div>
            </FormControl>
          </Flex>
          {/* THÔNG TIN THÊM */}
          <FormLabel
            fontWeight="bold"
            htmlFor="information"
            fontSize={20}
            mt={10}
            color="blue.400"
          >
            Thông tin thêm
          </FormLabel>
          <Divider mb={4} />
          {/* Cha dượng */}
          <FormLabel htmlFor="stepFathers">Cha Dượng</FormLabel>
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {stepFathers.map((person) => (
              <MiniInfoPerson
                information={person}
                onSet={null}
                onRemove={removeFromStepFathers}
              ></MiniInfoPerson>
            ))}
            <FormControl>
              <div>
                <Button
                  variant="warning"
                  onClick={openStepFathersSearch}
                  leftIcon={
                    <Icon
                      as={MdControlPoint}
                      boxSize={7}
                      color="blue.400"
                    />
                  }
                ></Button>
                <SearchPersonPopup
                  isOpen={isStepFathersSearchOpen}
                  onClose={closeStepFathersSearch}
                  onSelected={onSelectedStepFathers}
                />
              </div>
            </FormControl>
          </Flex>
          {/* Cha dượng */}
          <FormLabel htmlFor="stepMothers">Mẹ Kế</FormLabel>
          <Flex
            direction="row"
            align="flex-start"
            justify="space-between"
            mb={4}
          >
            {stepMothers.map((person) => (
              <MiniInfoPerson
                information={person}
                onSet={null}
                onRemove={removeFromStepMothers}
              ></MiniInfoPerson>
            ))}
            <FormControl>
              <div>
                <Button
                  variant="warning"
                  onClick={openStepMothersSearch}
                  leftIcon={
                    <Icon
                      as={MdControlPoint}
                      boxSize={7}
                      color="blue.400"
                    />
                  }
                ></Button>
                <SearchPersonPopup
                  isOpen={isStepMothersSearchOpen}
                  onClose={closeStepMothersSearch}
                  onSelected={onSelectedStepMothers}
                />
              </div>
            </FormControl>
          </Flex>
          <Button
            colorScheme="teal"
            type="submit"
            mr={5}
          >
            Thêm mới
          </Button>
          <Button
            colorScheme="red"
            onClick={handleCancel}
          >
            Nhập lại
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default CreatePerson;
