import lodash from 'lodash';
const convertLiveStatus = (status) => {
  if (lodash.upperCase(status) === 'ALIVE') {
    return 'Đang sống';
  } else if (status === 'DEAD') {
    return 'Đã chết';
  } else {
    return 'Chưa xác định';
  }
};

export default convertLiveStatus;
