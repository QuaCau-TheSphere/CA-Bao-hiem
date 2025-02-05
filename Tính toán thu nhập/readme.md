# Thay đổi định kỳ đóng phí

## Cách sử dụng
Các trường trong 
- Ngày đóng kế tiếp:
- Ngày đóng:
- Phí đóng:
- Tổng số phí hoàn thành:
- People:
## Tính số tiền ngày cuối đóng phí

Ngày đóng phí đầu tiên của thiết lập phí kỳ này là ngày sử dụng hết số tiền đã đóng của kỳ phí trước đó. Nó là kỳ phí cuối cùng của thiết lập cũ

## Tính ngày bắt đầu áp dụng thiết lập phí

Giả sử ngày 1/1/2025 khách hàng thiết lập chu kỳ phí là quý và đã đóng kỳ đầu tiên. Ngày 1/2 đổi chu kỳ quý sang năm. Vì đã đóng kỳ đầu tiên nên thiết lập này phải tới ngày 1/4 mới có hiệu lực. Nhưng tới ngày 1/3 lại đổi sang nửa năm. Thì code phải xác định được là kỳ phí đóng gần nhất thuộc thiết lập đầu tiên chứ không phải thứ hai.

## Cách hoạt động

Mỗi một lần thay đổi định kỳ đóng phí sẽ thiết lập lại chu kỳ và số tiền mỗi kỳ. Từ đó sẽ tính toán lịch sử và kế hoạch đóng phí. Trong code thì đó là việc chuyển từ `ThiếtLậpPhí` sang `VậtThểPhí`:

```ts
interface ThiếtLậpPhí {
  ngàyThiếtLập: NgàyThiếtLập;
  chuKỳ: ChuKỳ;
  sốTiềnMỗiKỳ: SốTiền;
}
interface VậtThểPhí extends ThiếtLậpPhí {
  lịchSửĐóngPhí: KỳPhí[];
  kếHoạchĐóngPhí: KỳPhí[];
}
```
