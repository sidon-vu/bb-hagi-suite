# Hướng dẫn làm việc trong bb-hagi-suite

- Đọc `README.md` trước. Thông tin từng plugin nằm ở `catalog/<plugin>.md`.
- Mỗi tính năng mới là một module riêng trong `plugins/<plugin>/features/` kèm một công tắc `boolean` mặc định tắt trong `bb.settings.define`. Tính năng tắt thì không hiển thị và không chạy gì.
- Sidebar và danh sách thread chỉ có một bản chạy: dùng ô chọn (`select`), đừng làm công tắc riêng cho từng bản.
- Trước khi chép code từ plugin trên chợ: đọc `LICENSE` của repo gốc, ghi giấy phép vào `catalog/<plugin>.md`, rồi ghi một dòng vào `PROVENANCE.md` (repo, commit, tác giả, giấy phép, phần đã dùng). Không có giấy phép thì không chép, chỉ viết lại theo ý tưởng.
- Clone plugin của người khác vào một thư mục riêng ngoài repo này, chỉ đọc. Không chạy script cài đặt của họ. Soát các đoạn gọi mạng, đọc file và lấy khóa bí mật trước khi nhập.
- Cập nhật `catalog/<plugin>.md` cùng lúc với code: bảng "Plugin này đang có gì" và cột trạng thái của plugin tham khảo.
- Mọi quyết định đã chốt khi phân tích/thiết kế phải ghi vào `catalog/<plugin>.md` (mục "Quyết định đã chốt") ngay khi chốt — kể cả khi tính năng chưa làm xong, để buổi làm sau không phải phân tích lại.
- Chạy `bb plugin build` trong thư mục plugin trước khi coi là xong.
