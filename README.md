# Anh gửi bé · Màn trình diễn 20/10

**Next.js + React + TypeScript + Motion.** Trải nghiệm kể chuyện trong một màn hình cố định, tông hồng baby và trắng. Không có trang dài, cuộn dọc hoặc album dạng lưới.

## Mở

Nhấp đúp `D:\20_10\MO-WEBSITE.cmd`, giữ cửa sổ mở rồi vào **http://localhost:3000**.

Hoặc:

```powershell
cd D:\20_10\gift
npm start
```

Khi clone từ GitHub lần đầu:

```powershell
npm ci
npm run build
npm start
```

Nếu server đã chạy, mở trực tiếp địa chỉ trên. Để xem lại bản mới sau khi sửa, nhấn `Ctrl+Shift+R`.

## Năm cảnh

1. **Một bó hoa** — bó hoa tách nền ở chính giữa, nền mây và lụa hồng, ảnh hai bạn lơ lửng phía sau. Chạm hoa để tung hoa khắp màn hình và lần lượt đọc 6 lời chúc. Có hai bó hoa để đổi.
2. **Ảnh của tụi mình** — 15 ảnh trong một vòng ảnh có phối cảnh 3D bằng CSS. Ảnh tự chuyển sau 4,8 giây; có thể tạm dừng, kéo ảnh, dùng mũi tên hoặc mở ảnh lớn.
3. **Hẹn bé một hôm** — đúng hai câu hỏi: chọn kiểu hẹn và giao nhiệm vụ cho anh. Hai ảnh biểu cảm phản hồi từng lựa chọn. Câu trả lời ghép thành một tấm hẹn có ảnh hai bạn, có thể chụp lại gửi anh. Không có điểm số hay đáp án chặn lối đi.
4. **Mấy lời gửi bé** — ba đoạn thư ngắn hiện lần lượt, bé bấm để đọc theo nhịp của mình.
5. **Một cái ôm** — ảnh ghép thành trái tim và lời chúc 20/10. Chạm hoặc giữ trái tim 1,2 giây: ảnh tiến lại gần, vòng sáng lan ra và hoa nở cùng lời nhắn ôm bé. Hỗ trợ nhấp chuột, cảm ứng và bàn phím; không có câu hỏi thứ ba.

Các cảnh nối nhau bằng chuyển cảnh tiến/lùi, ánh sáng quét, mờ dần và hoa bay. Không cuộn chuột để chuyển cảnh.

## Điều khiển

- Nút chữ ở góc dưới bên phải: đi tiếp hoặc đọc đoạn tiếp.
- Mũi tên trái ở cạnh nút đi tiếp: về cảnh trước.
- Năm vạch dưới màn hình: chọn một cảnh.
- Phím mũi tên phải/trái khi không focus nút: tiếp/lùi.
- Trong album: kéo sang trái/phải hoặc bấm nút chuyển ảnh. Chạm ảnh giữa để mở lớn; `Escape` để đóng.
- Nút nhạc phía trên: bật/tắt giai điệu hộp nhạc tổng hợp bằng Web Audio. Chỉ phát sau thao tác của người xem.
- Nút tạm dừng phía trên: tắt/bật chuyển động. Thiết lập `prefers-reduced-motion` của thiết bị cũng được hỗ trợ.
- Nút “anh gửi bé” hoặc nút phát lại ở cảnh cuối: bắt đầu lại câu chuyện.

Không có tin nhắn hay lịch hẹn tự gửi. Các lựa chọn là tương tác trong trình duyệt.

## Chỉnh sửa

```powershell
npm run dev
```

Chỉ chạy một server trên cổng 3000. `Ctrl+C` để dừng.

- `src/components/love-story.tsx`: điều khiển 5 cảnh và tấm hẹn từ hai lựa chọn.
- `src/components/hug-moment.tsx`: tương tác chạm/giữ để nhận cái ôm.
- `src/components/dream-space.tsx`: các ảnh nền bay và lớp không gian.
- `src/components/flower-canvas.tsx`: hoa bung, chuyển động và mật độ hạt.
- `src/components/music-button.tsx`: âm nhạc tự tổng hợp.
- `src/lib/story.ts`: 15 chú thích ảnh, 6 lời chúc, 3 đoạn thư và 2 câu hỏi.
- `src/app/fonts.css`, `src/app/fonts/`: font đầy đủ ký tự tiếng Việt, file WOFF2 và giấy phép OFL.
- `src/app/globals.css`: toàn bộ hình ảnh, bố cục theo kích thước màn hình và hoạt ảnh.
- `public/images/`: ảnh đã tối ưu; ảnh `*-full.webp` dành cho mở lớn.
- `artifacts/image-generation.md`: prompt và nguồn các tài sản tạo/tách nền bằng ImageGen.

Ảnh gốc người dùng gửi được giữ nguyên ngoài thư mục dự án. Ảnh người thật chỉ được thu kích thước/chuyển định dạng, không sửa mặt bằng AI. Hai bó hoa được tách nền bằng ImageGen; có thể có khác biệt nhỏ về chi tiết.

## Build và kiểm tra

```powershell
npm run typecheck
npm run build
npm start
# Terminal thứ hai:
npm test
```

Kiểm thử dùng Chrome cài trên máy: đi qua đủ 5 cảnh, 6 lời chúc, 15 ảnh, nhạc, tất cả nhánh trả lời, tấm hẹn, thư, chạm/giữ và bàn phím để ôm, phát lại; kiểm tra không cuộn trang, màn hình nhỏ 320×568, ngang 844×390, reduced motion và axe accessibility. Có kiểm tra font thực tế qua Chrome DevTools cho toàn bộ dấu tiếng Việt, chữ hoa/thường và Unicode NFC/NFD. Ảnh và báo cáo kiểm tra bản hiện tại có tiền tố `artifacts/v3-` (tạo khi chạy test, không đưa vào Git).

`out/` là bản web tĩnh đã build. Server trong `scripts/serve.mjs` có nén gzip và cache tài sản. Font được lưu trong dự án; không tải từ Google Fonts khi mở trang.

Font lấy từ kho [Google Fonts](https://github.com/google/fonts), giữ nguyên ký tự và bảng định hình, chỉ cố định độ đậm và nén WOFF2. Không ghép các subset Latin/Vietnamese, tránh lỗi dấu tách rời rơi sang font hệ thống. Script `fetch-fonts.mjs` và `prepare-fonts.py` ghi lại quá trình chuẩn bị; người clone repo không cần chạy lại vì WOFF2 đã được lưu sẵn.

## Đưa lên mạng

Bản hiện tại chạy local, chưa có URL công khai. `localhost` chỉ dùng trên máy chạy server.

Có thể upload nội dung `out/` lên hosting tĩnh, hoặc đưa dự án `gift` lên Vercel với lệnh build `npm run build` và output `out`. Không cần database hay API key. Trang khai báo `noindex`; khai báo này không thay thế mật khẩu nếu cần giới hạn người xem.

## Tham khảo dàn dựng

- [Noomo ValenTime — quy trình dựng câu chuyện tình yêu trong không gian](https://noomoagency.com/insights/noomo-valentime-immersive-storytelling).
- [The Field — Active Theory](https://medium.com/active-theory/the-field-bbe924426d7f).

Tham khảo cách tổ chức không gian, nhịp tương tác và tính liên tục giữa các cảnh; mã nguồn, nội dung tiếng Việt và dàn cảnh ở đây được viết riêng cho món quà.

Ghi chú biên tập và nguồn tham khảo tiếng Việt: [artifacts/content-notes.md](artifacts/content-notes.md).
