export default function randomCic() {
  // Mặc định 2 số đầu là 92
  const prefix = '92';

  // Lấy ngày tháng năm hiện tại
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Lấy 2 số cuối của năm
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm 0 nếu cần
  const day = String(now.getDate()).padStart(2, '0'); // Lấy ngày, thêm 0 nếu cần

  // Random 2 số cuối
  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0'); // Tạo 2 số ngẫu nhiên, thêm 0 nếu cần

  // Kết hợp tất cả các phần lại với nhau
  const cic = `${prefix}${year}${month}${day}${randomDigits}`;

  return cic;
}
