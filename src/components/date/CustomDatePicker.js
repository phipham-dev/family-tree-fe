import React from 'react';
import { Input } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import vi from 'date-fns/locale/vi';

registerLocale('vi', vi);
setDefaultLocale('vi');

// Tạo component tùy chỉnh cho DatePicker
const CustomDatePicker = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="dd/MM/yyyy"
      customInput={<Input width="100%" />}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      locale="vi"
      placeholderText="Chọn Ngày / Tháng / Năm"
      popperModifiers={{
        offset: {
          offset: '0,10px',
        },
      }}
      maxDate={new Date()} // This sets the maximum selectable date to today
    />
  );
};

export default CustomDatePicker;
