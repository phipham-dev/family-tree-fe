import lodash from 'lodash';
const convertMaritalStatus = (maritalStatus) => {
  if (lodash.upperCase(maritalStatus) === 'SINGLE') {
    return 'Độc thân';
  } else if (maritalStatus === 'MARRIED') {
    return 'Kết hôn';
  } else if (maritalStatus === 'DIVORCED') {
    return 'Ly hôn';
  } else {
    return 'Chưa xác định';
  }
};

export default convertMaritalStatus;
