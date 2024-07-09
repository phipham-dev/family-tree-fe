import Swal from 'sweetalert2';
import lodash from 'lodash';

export const showWarningAlert = (message) => {
  Swal.fire({
    icon: 'warning',
    title: 'Cảnh báo',
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showErrorAlert = (error, title = 'Lỗi') => {
  const status = lodash.get(error, 'response.status', 500);
  let message = 'Xin vui lòng thử lại hoặc thông báo đến ban quản lí để được hỗ trợ!';
  if (status !== 500) {
    message = lodash.get(error, 'response.data.message', 'Xin vui lòng thử lại');
  }
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
};
