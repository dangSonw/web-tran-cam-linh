# Open / Home resize regression — 2026-10-23

## Lỗi và cách sửa

- Đã tái hiện: mở Home ở 390×568 rồi tăng lên 1440×1000 làm rèm Open lộ lại khoảng 432,5 px. Transform dùng chiều cao cũ bằng px, animation đã dừng và endpoint chưa được chốt chính xác.
- Rèm hiện dịch theo phần trăm chiều cao của chính nó, chốt endpoint bằng spring, rồi chuyển sang `visibility: hidden` và `inert`. Hoạt động cả khi resize giữa chuyển động.
- Home dùng một navigation duy nhất, đổi 2/4 cột theo không gian thực tế. Grid dành riêng vùng bảng tên và lời chào, có khoảng cách dự phòng khi tăng cỡ chữ.
- Chữ dùng một thang co giãn liên tục theo cả chiều rộng và chiều cao; không nhảy cỡ tại breakpoint navigation.
- Hover/focus/press chỉ scale artwork; vùng bấm không dịch chuyển. Spring chạy qua requestAnimationFrame, dừng khi đã ổn định và giữ vận tốc khi đảo hướng.

## Kết quả kiểm thử

| Bộ kiểm tra | Kết quả |
| --- | --- |
| `npm.cmd run lint` | PASS |
| `npm.cmd run build` | PASS |
| `live-resize-check.js` | PASS: 23 lượt đổi kích thước trên cùng trang đã tải, thêm 4 lần resize giữa lúc rèm đang chuyển động |
| `motion-interaction-check.js` | PASS: autoplay, CTA, hover, focus, keyboard, link, reverse wheel, đảo chiều nhanh, vuốt touch mô phỏng, CPU throttle 4× |
| `production-resize-check.js` | PASS: 49 bước resize liên tục, chữ 200%, context mobile DPR 2, tap liên kết, tải asset, nhỏ → lớn sau khi quay lại Open |
| Console production | 0 errors, 0 warnings |

Các kích thước kiểm tra gồm 320×480, 320×568, 390×568, 390×844, 412×915, 568×320, 844×390, 768×1024, 1024×768, 1440×900, 1440×1000, 1920×1080, 2560×1440, 3440×1440 và 1920×300. Có kiểm tra sát các điểm chuyển bố cục và đổi kích thước cả hai chiều.

Lần đo chuyển động trên máy Windows hiện tại ghi nhận 39 frame đang chuyển động, p95 khoảng cách frame 16,8 ms. Đây là số đo của phiên Chrome kiểm thử, không phải cam kết hiệu năng trên mọi thiết bị.

Touch được tổng hợp bằng Chrome CDP và context có `hasTouch`; chưa kiểm tra trên điện thoại vật lý hoặc Safari/Firefox. Kiểm tra chữ 200% tăng root font-size; đây không phải thao tác zoom toàn trang của Chrome.

## Tái chạy

Chạy từ thư mục `D:\Web\web-tran-cam-linh-folio`. Cần dev server ở cổng 5173 và production preview ở cổng 4173, mỗi server trong một terminal riêng:

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
```

Trong terminal kiểm thử:

```powershell
playwright-cli open http://127.0.0.1:5173 --browser=chrome
playwright-cli --raw run-code --filename=artifacts/responsive/live-resize-check.js
playwright-cli --raw run-code --filename=artifacts/responsive/motion-interaction-check.js
playwright-cli --raw run-code --filename=artifacts/responsive/production-resize-check.js
playwright-cli close
```

Mỗi script trả JSON với `passed`, các kiểm tra và lỗi console. Không chỉ dựa vào exit code của CLI: kiểm tra `passed: true` trong kết quả.

## Bằng chứng mới nhất

- `live-resize-results.json`
- `motion-interaction-results.json`
- `production-resize-results.json`
- `resize-before.png`: lỗi đã tái hiện trước khi sửa.
- `resize-fixed-*.png`: Home sau khi đổi kích thước trực tiếp.
- `motion-t0-open.png`, `motion-t1-reveal.png`: hai thời điểm của chuyển động thực.
- `production-home-desktop-final.png`, `production-home-mobile-dpr2.png`: giao diện bản build.
- `production-text-200-percent.png`: khoảng cách và nội dung khi tăng cỡ chữ.

Các file `viewport-check.js`, `interaction-check.js`, `production-smoke.js` và ảnh không có tiền tố mới ở trên là bằng chứng của phiên triển khai trước, không phải bộ regression hiện tại. Bộ mới kiểm tra resize ngay trên Home, thay vì tải lại trang ở mỗi kích thước.
