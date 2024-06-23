import Swal from 'sweetalert2';

export const showSuccessAlert = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: message,
    confirmButtonText: 'OK',
  });
};

export const showErrorAlert = (message, title = 'Lỗi') => {
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
  });
};
