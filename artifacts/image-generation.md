# Ảnh hoa

Được xử lý bằng công cụ ImageGen tích hợp. Ảnh người thật không dùng AI để sửa mặt; chỉ xoay theo EXIF, thu kích thước và chuyển WebP.

## Không gian của bản storytelling

- PNG: `artifacts/generated/dream-sky.png`.
- Bản website: `public/images/dream-sky.webp`.
- Công cụ: ImageGen tích hợp, tạo mới.
- Prompt:

> Asset type: wide cinematic atmospheric background for a romantic interactive Vietnamese Women's Day love letter. Dreamlike airy baby-pink and pearl-white space, soft luminous blush clouds and delicate translucent white silk ribbons gently sweeping along the extreme left and right edges, a few out-of-focus soft pink flower petals near the edges, subtle warm pearlescent light and depth of field. Center 65% almost empty luminous ivory-white with extremely subtle rose tint, reserved for an isolated bouquet and readable dark rose text added by code. No room, no horizon line, no floor, no podium, no vase, no object in center, no text or letters, no logo, no people, no hearts. Sophisticated photorealistic art direction, delicate and tender, bright pastel palette, low contrast. Landscape 16:9 composition. Should feel like a magical airy dream, not a product catalog or banner.

## Bó hồng

- Nguồn: ảnh đầu tiên trong thư mục `D:\20_10\hoa`.
- Bản PNG nền trong suốt: `artifacts/generated/bouquet.png`.
- Bản website: `public/images/bouquet.webp`.
- Prompt:

> Use case: background-extraction. Extract the entire pink and white rose bouquet with its white paper wrapping and ribbon from the supplied photograph. Remove person, arms, floor, walls and background, preserving original bouquet shape, flower arrangement, colors and paper texture faithfully. Center complete bouquet as a clean photorealistic cutout with 5% transparent margin. Actual transparent alpha background, no added background or shadow. This is a clickable bouquet asset in a romantic website. Keep the full bouquet and ribbon visible.

## Bó pastel

- Nguồn: ảnh chụp màn hình thứ hai trong thư mục `D:\20_10\hoa`.
- Bản PNG: `artifacts/generated/bouquet-pastel.png`.
- Bản website: `public/images/bouquet-pastel.webp`.
- Prompt:

> Use case: background-extraction. Extract ONLY the complete pastel multicolored bouquet from the supplied screenshot including its white paper wrapping, center pink lily and trailing pale pink ribbon. Preserve original arrangement and colors. Remove all screenshot interface, vehicle, person, and environment. Center the whole bouquet with 5% transparent margin as a clean photorealistic product cutout, true alpha transparency. No added text or background. Keep complete trailing ribbon.

## Hoa bay

- Ảnh tạo mới: `artifacts/generated/flower.png`.
- Sprite WebP 256px: `public/images/flower.webp`.
- Prompt:

> A single photorealistic pale blush pink daisy flower head viewed directly from above, many soft delicate rounded pink petals and a small warm cream yellow center. Isolated on actual transparent alpha background. No stem, no leaves, no text, no shadow outside flower. Flower fills 90 percent of a square composition. High-end botanical photography, soft lighting. Asset used as flying flowers on a romantic baby pink website.

Đây là kết quả tách nền bằng mô hình tạo ảnh nên các chi tiết hoa có thể khác nhẹ so với ảnh gốc. Các file PNG nguồn được giữ cùng dự án để có thể dùng lại hoặc xuất kích thước khác.
