export const photos = [
  { id: 7, caption: "Anh chọn hoa. Còn bé làm tấm hình này xinh.", category: "Bé xinh" },
  { id: 4, caption: "Tấm này anh thích. Tấm sau cũng vậy.", category: "Bé xinh" },
  { id: 8, caption: "Thích nhất là trong ảnh có cả hai đứa.", category: "Có đôi có cặp" },
  { id: 2, caption: "Từ từ ăn nha, anh chụp xong rồi.", category: "Bé mê ăn" },
  { id: 11, caption: "Bé nháy mắt một cái, anh quên định nói gì.", category: "Bé xinh" },
  { id: 6, caption: "Đi chơi với bé, anh hay có ảnh đẹp mang về.", category: "Bé xinh" },
  { id: 14, caption: "Sau này mình chụp thêm nhiều tấm như này nha.", category: "Có đôi có cặp" },
  { id: 13, caption: "Một cái hẹn ngon lành của tụi mình.", category: "Bé mê ăn" },
  { id: 5, caption: "Hoa che mất một chút, vẫn thấy bé xinh.", category: "Bé xinh" },
  { id: 9, caption: "Mong bé có thật nhiều hôm vui như vầy.", category: "Bé xinh" },
  { id: 10, caption: "Tấm này làm anh muốn gặp bé ghê.", category: "Bé xinh" },
  { id: 1, caption: "Không cần dịp gì, anh vẫn thích ngắm bé.", category: "Bé xinh" },
  { id: 15, caption: "Đi ăn với bé cũng tính là một ngày đẹp.", category: "Bé mê ăn" },
  { id: 3, caption: "Định chọn một tấm thôi. Rồi anh giữ hết.", category: "Bé xinh" },
  { id: 12, caption: "Hết ảnh rồi. Còn nhớ bé thì chưa.", category: "Bé xinh" },
];
export const photoSrc = (id: number, full = false) => `/images/photo-${String(id).padStart(2, "0")}${full ? "-full" : ""}.webp`;
export const wishes = [
  { title: "20/10 vui thật vui nha bé.", text: "Có hoa rồi nè. Giờ chúc bé một ngày được ăn ngon, được cười nhiều và được chiều hơn mọi hôm một chút." },
  { title: "Thương bản thân thêm chút nha.", text: "Chúc bé có thời gian làm điều mình thích, được nghỉ ngơi mà không thấy áy náy, và được vui theo cách của bé." },
  { title: "Mong bé bớt nghĩ nhiều.", text: "Tối nay ngủ một giấc thật ngon nha. Chuyện nào chưa xong thì để mai tính tiếp, bé cũng cần được nghỉ mà." },
  { title: "Điều bé mong, rồi sẽ tới.", text: "Chúc những cố gắng của bé có kết quả thật xứng đáng. Hôm nào có tin vui, kể anh nghe với. Anh muốn vui cùng bé." },
  { title: "Mệt thì dựa anh một chút.", text: "Không cần phải vui mới được tìm anh đâu. Muốn kể chuyện hay chỉ muốn ngồi yên cạnh nhau, anh đều thích." },
  { title: "Còn nhiều cái hẹn nữa nha.", text: "Thêm vài quán ngon, vài chỗ chưa đi, thêm nhiều ảnh của hai đứa. Hoa là quà hôm nay, còn thương bé là chuyện mỗi ngày." },
];
export const letters = [
  { title: "Có bé rồi,", emphasis: "ngày thường cũng vui.", text: "Có người để gửi tấm hình vừa chụp, kể mấy chuyện linh tinh, rồi rủ đi ăn dù mới gặp hôm qua. Anh thích những ngày có bé như vậy.", last: "Chẳng cần dịp gì lớn lao hết." },
  { title: "Chúc bé có nhiều ngày", emphasis: "thấy mình thật vui.", text: "Làm được điều bé thích, gặp được người quý bé, và tối về thấy hôm nay cũng ổn ghê. Có hôm không ổn thì kể anh nghe, anh ở đây mà.", last: "20/10, và cả những ngày bình thường nữa." },
  { title: "Có một điều anh", emphasis: "muốn nói thêm.", text: "Anh muốn có thêm nhiều buổi đi chơi với bé. Muốn nghe bé kể chuyện, được nắm tay bé, và lâu lâu làm một điều khiến bé cười như hôm nay.", last: "Thương bé. Câu này là thật, không trêu đâu." },
];
// Two preferences become a date invitation. Neither answer blocks the story.
export const questions = [
  {
    title: "Một buổi hẹn của hai đứa, bé thích kiểu nào?",
    note: "Anh hỏi để còn lên lịch với bé đó.",
    answers: [
      { text: "Đi ăn ngon, rồi dạo một vòng", reaction: "sweet", reply: "Chốt. Bé chọn món, ăn xong mình đi dạo. Anh muốn có thêm một buổi tối chẳng phải vội về.", sticker: "anh giữ lịch rồi nha", keepsake: "Ăn một bữa ngon, rồi đi dạo cùng nhau." },
      { text: "Ngồi cạnh nhau, nói đủ thứ chuyện", reaction: "sweet", reply: "Anh thích kiểu này. Tìm một góc yên yên, cất điện thoại, nghe bé kể hết chuyện trong ngày.", sticker: "dành thời gian cho bé", keepsake: "Một góc yên yên, nghe bé kể đủ thứ chuyện." },
    ],
  },
  {
    title: "Còn anh, bé giao nhiệm vụ gì?",
    note: "Anh có mặt. Chờ bé phân công thôi.",
    answers: [
      { text: "Nắm tay bé, không được buông", reaction: "sweet", reply: "Được luôn. Tay này anh giữ. Lỡ bé thấy món gì ngon thì mình cùng dừng lại nha.", sticker: "việc này anh thích", keepsake: "Nắm tay bé suốt buổi hẹn." },
      { text: "Chụp hình cho bé tới khi ưng", reaction: "tease", reply: "Anh tưởng được làm nam chính, ai dè được làm nhiếp ảnh gia. Rồi, bé cứ tạo dáng đi, anh chụp!", sticker: "cho anh vào một tấm với", keepsake: "Chụp cho bé thật nhiều ảnh. Nhớ có một tấm chung." },
    ],
  },
] as const;
