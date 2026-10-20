# ECONVERSE — Premium UI/UX Redesign & Centralized Theme System

Nâng cấp toàn diện giao diện website **ECONVERSE** theo chuẩn EdTech cao cấp (kết hợp độ tinh tế của Apple, sự chuẩn xác của Linear và tính rõ ràng của Notion), hoàn thiện hệ thống chuyển đổi **Light / Dark / System Mode** không flash, cùng bố cục học tập 3 cột trực quan và đồng bộ thiết kế toàn hệ thống.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là các quyết định quan trọng đã được thống nhất tại Phase 1 và phương án triển khai chuẩn hoá:

- **Confirmed Decision 1 (Theme Switcher)**: Sử dụng **Segmented Control** tích hợp ngay trên Header với 3 icon: **Mặt trời (Light)**, **Mặt trăng (Dark)**, và **Màn hình (System)**. Có hiệu ứng trượt mượt mà (smooth pill highlight), tooltip giải thích, và đồng bộ tự động khi OS thay đổi mà không cần reload.
- **Confirmed Decision 2 (Lesson Detail Workspace)**: Bố cục học tập **3 cột chuyên sâu (Three-column layout)** trên màn hình lớn: Cột 1 (Mục lục Module & tiến độ), Cột 2 (Nội dung học thuật trọng tâm, biểu đồ & mô phỏng tương tác), Cột 3 (Công cụ học tập: Ghi chú nhanh, Mini Pomodoro, Chỉ số bài học). Trên màn hình nhỏ/tablet, tự động co gập hoặc chuyển thành ngăn kéo (Drawer/Tabs) tiện lợi.
- **Confirmed Decision 3 (Aesthetic & Palette)**: Phong cách **Modern Tech Palette** với nền Dark slate sâu (`#080D1A`), nền Light sạch tinh khôi (`#F8FAFC`), điểm nhấn Sapphire Blue (`#2563EB` / `#60A5FA`) kết hợp màu tím thứ cấp (`#7C3AED` / `#A78BFA`) và Cyan accent (`#06B6D4` / `#22D3EE`).
- **Markdown & Content Fidelity**: Đảm bảo toàn bộ chữ in đậm (`**...**`), trích dẫn, công thức toán và bảng biểu từ tài liệu MLN122 được render sắc nét, không để lộ cú pháp thô, tuyệt đối giữ nguyên 100% dữ liệu gốc của giáo trình.

---

### 1. Overview & Core Concept

- **What It Does**: ECONVERSE là nền tảng học tập tương tác số 1 về Kinh tế chính trị Mác – Lênin (Chương 2: Bốn quy luật kinh tế của sản xuất hàng hóa: Quy luật Giá trị, Quy luật Cung - Cầu, Quy luật Lưu thông tiền tệ, và Quy luật Cạnh tranh). Nền tảng kết hợp lý thuyết chính xác với dữ liệu thực nghiệm Việt Nam (sản xuất cà phê Đắk Lắk/Lâm Đồng, biến động giá Tết Nguyên đán, cạnh tranh thương mại điện tử Shopee/Lazada, và phương trình lưu thông tiền tệ của Karl Marx).
- **Target Audience / Persona**: Sinh viên đại học đang học môn Triết học / Kinh tế chính trị Mác – Lênin, giảng viên cần công cụ trình chiếu trực quan sinh động trên giảng đường, và người nghiên cứu kinh tế ứng dụng.
- **Key Value**: Xoá bỏ sự khô khan của lý thuyết bằng các biểu đồ tương tác, máy tính mô phỏng tham số thời gian thực, flashcard lật 3D, phòng thi trắc nghiệm bấm giờ, và trợ lý AI phân tích tình huống thực tế.

---

### 2. User Experience & Visual Design

#### 2.1. Key User Flows
1. **Khám phá & Chọn bài học (Overview & Navigation)**: Người học xem dashboard tiến độ tổng quan (XP, streak, số module hoàn thành), nhấn chọn 1 trong 4 quy luật kinh tế để vào học ngay.
2. **Không gian học tập 3 cột (Study Workspace)**:
   - Cột trái: Điều hướng bài học nhanh, đánh dấu hoàn thành, xem số trang PDF gốc.
   - Cột giữa: Đọc nội dung bài học định dạng chuẩn, tương tác với biểu đồ thanh so sánh hiệu quả cà phê, thử nghiệm mô phỏng điểm cân bằng Cung - Cầu bằng thanh trượt, hoặc tính lượng tiền tệ cần thiết cho lưu thông.
   - Cột phải: Ghi chú nhanh gắn với bài học, mở đồng hồ Pomodoro Focus đếm ngược, hoặc kích hoạt Trợ lý AI giải thích tình huống.
3. **Thực hành Flashcard & Thi thử (Active Recall & Testing)**: Luyện 20 thẻ ghi nhớ với hiệu ứng 3D flip mượt mà; làm bài kiểm tra trắc nghiệm 10 câu có bấm giờ và giải thích chi tiết trích dẫn từ PDF.
4. **Trình chiếu Giảng đường (Presentation Mode)**: Chế độ toàn màn hình không phân tâm dành cho thuyết trình nhóm hoặc giảng bài với slide tóm tắt cô đọng.

#### 2.2. Visual Identity & Theme System
Thiết lập hệ thống semantic tokens chuẩn xác, phân tách triệt để giữa logic và giao diện:

| Semantic Token | Light Mode | Dark Mode | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| `--bg-app` | `#F8FAFC` (Slate 50) | `#080D1A` (Deep Navy Slate) | Nền tổng thể trang web |
| `--surface-card` | `#FFFFFF` (Pure White) | `#111827` (Slate 900) | Thẻ nội dung chính |
| `--surface-card-subtle` | `#F1F5F9` (Slate 100) | `#1E293B` (Slate 800) | Nền phụ, input, khu vực phụ |
| `--surface-elevated` | `#FFFFFF` (Shadow md) | `#182234` (Navy 850) | Modal, dropdown, tooltip |
| `--border-subtle` | `rgba(15, 23, 42, 0.08)` | `rgba(248, 250, 252, 0.08)` | Đường viền mỏng hairline (1px) |
| `--border-strong` | `rgba(15, 23, 42, 0.16)` | `rgba(248, 250, 252, 0.16)` | Viền active, viền hover |
| `--text-main` | `#0F172A` (Slate 900) | `#F8FAFC` (Slate 50) | Tiêu đề và nội dung quan trọng |
| `--text-muted` | `#64748B` (Slate 500) | `#94A3B8` (Slate 400) | Nhãn phụ, mô tả, chú thích |
| `--color-primary` | `#2563EB` (Blue 600) | `#60A5FA` (Blue 400) | Điểm nhấn chính, nút CTA, active |
| `--color-secondary` | `#7C3AED` (Purple 600) | `#A78BFA` (Purple 400) | Điểm nhấn quy luật, phân loại |
| `--color-accent` | `#0891B2` (Cyan 600) | `#22D3EE` (Cyan 400) | Dữ liệu thống kê, highlight |

#### 2.3. Typography & Hierarchy
- **Font gia đình**: `Be Vietnam Pro` (tối ưu tiếng Việt tuyệt đối, sắc nét) kết hợp `Plus Jakarta Sans` và `JetBrains Mono` cho số liệu/công thức toán.
- **Tiêu đề Display**: Khử hiện tượng mồ côi từ (`text-wrap: balance`), phân cấp rõ rệt từ H1 (28-32px), H2 (20-24px), H3 (16-18px) đến nhãn siêu nhỏ (11-12px tabular).
- **Trình bày Markdown**: Kiểm tra bộ xử lý Markdown, bảo đảm `**In đậm**`, danh sách bullet, bảng dữ liệu và khối công thức KaTeX không bị tràn ngang hoặc mất màu trong Dark Mode.

#### 2.4. Data Visualizations & Charts
- Toàn bộ 4 biểu đồ:
  1. **CoffeeEfficiencyChart**: So sánh năng suất, chi phí và lợi nhuận giữa hộ cà phê chứng nhận (SC) và không chứng nhận (Non-SC).
  2. **TetPriceChangeChart**: Chu kỳ biến động giá thịt lợn, hoa tươi và vé máy bay dịp cận Tết và sau Tết.
  3. **EcommerceCompetitionChart**: Cạnh tranh thị phần và cuộc chiến giá/freeship giữa các sàn TMĐT.
  4. **MoneyCirculationChart**: Minh họa lượng tiền cần thiết theo tốc độ vòng quay và tổng giá cả hàng hóa.
- **Yêu cầu Theme**: Cập nhật màu lưới (`grid`), nhãn trục (`axis`), tooltip hover, màu cột và đường xu hướng phản ứng tức thì khi chuyển theme mà không cần reload.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Quản trị Theme tập trung với `ThemeProvider` & `ThemeSwitcher`**
  - *Chosen Approach*: Tạo Context `ThemeProvider` chuyên dụng quản lý 3 giá trị `'light' | 'dark' | 'system'`. Lưu trạng thái trong `localStorage`. Tự động lắng nghe `window.matchMedia('(prefers-color-scheme: dark)')` khi ở chế độ `system`. Đồng bộ tức thì giữa các tab qua event `storage`.
  - *Why*: Tránh phân tán logic `document.documentElement.classList`, loại bỏ triệt để hiện tượng nhấp nháy sáng (FOUT) khi tải lại trang, và đáp ứng 100% test case TC01–TC16 của đề bài.
  - *Alternatives Considered*: Chỉ toggle class thủ công trong `App.tsx` (cách cũ) → Bị lỗi khi người dùng muốn theo dõi theme của hệ điều hành và không thể đồng bộ cross-tab.

- **Decision 2: Cấu trúc Lesson Detail 3 cột linh hoạt (Responsive Split Workspace)**
  - *Chosen Approach*: Bố cục Grid 3 cột (`w-64` TOC | `flex-1` Content | `w-80` Tools) trên desktop $\ge 1280\text{px}$. Trên laptop ($1024\text{px} - 1279\text{px}$), cột Tools chuyển thành tab hoặc ngăn kéo có thể bật/tắt. Trên tablet/mobile, hiển thị 1 cột duy nhất với nút mở nhanh Mục lục và Ghi chú.
  - *Why*: Giúp sinh viên vừa đọc giáo trình vừa ghi chú và theo dõi thời gian tập trung mà không phải chuyển qua lại giữa các trang.

- **Decision 3: Xử lý Markdown tự trị vững chắc (Resilient Markdown Component)**
  - *Chosen Approach*: Xây dựng `MarkdownRenderer` chuẩn hóa với hỗ trợ đầy đủ font weight đậm (`font-bold text-theme-main`), danh sách, bảng biểu và trích dẫn, đảm bảo tương thích 100% với React 19 mà không gây crash phụ thuộc.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              ECONVERSE APP                             │
├────────────────────────────────────────────────────────────────────────┤
│                       ThemeProvider (useTheme)                         │
│  - State: 'light' | 'dark' | 'system'                                  │
│  - OS Sync: matchMedia('(prefers-color-scheme: dark)')                │
│  - Storage Sync: localStorage ('econverse_theme_mode')                 │
│  - Head Anti-Flash: inline snippet in index.html                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│     Global Navigation         │              │        Active View Area       │
│  - 3-Zone Header Contract     │              │  - HomeView (Bento Grid)      │
│  - Segmented ThemeSwitcher    │              │  - Lesson Workspace (3-Col)   │
│  - Spotlight Search (Cmd+K)   │              │  - FlashcardDeck (3D Flip)    │
│  - Mobile Bottom Bar          │              │  - QuizRunner (Timed Exam)    │
└───────────────────────────────┘              │  - Mindmap / Analytics / Notes│
                                               └───────────────┬───────────────┘
                                                               │
                                         ┌─────────────────────┴───────────────┐
                                         ▼                                     ▼
                          ┌─────────────────────────────┐       ┌─────────────────────────────┐
                          │    Interactive Economics    │       │    Study Tooling & Modals   │
                          │  - CoffeeEfficiencyChart    │       │  - PomodoroTimer (Focus)    │
                          │  - SupplyDemandSimulator    │       │  - NotesManager (Storage)   │
                          │  - TetPriceChangeChart      │       │  - AiStudyAssistant (Drawer)│
                          │  - MoneyEquationCalculator  │       │  - PdfViewerModal (Exact p.)│
                          │  - EcommerceCompetitionChart│       │  - PresentationView (Slides)│
                          └─────────────────────────────┘       └─────────────────────────────┘
```

#### File Structure & Refactoring Scope
1. **Theme Infrastructure**:
   - `src/context/ThemeContext.tsx`: Cung cấp `useTheme()`, `themeMode` (`light` | `dark` | `system`), `resolvedTheme` (`light` | `dark`), và `setThemeMode`.
   - `src/components/common/ThemeSwitcher.tsx`: Segmented control tinh xảo với icon Sun, Moon, Monitor, tooltip và phím tắt/keyboard accessibility.
   - `src/styles/tokens.css` & `src/styles/theme.css`: Bổ sung đầy đủ semantic variables, xử lý contrast text, scrollbar, KaTeX và border tokens.
   - `index.html`: Thêm pre-render script chống nhấp nháy sáng màn hình.
2. **Layout & Header Refactor**:
   - `src/components/layout/Header.tsx`: Tuân thủ Top Bar Contract 3 vùng (Brand Wordmark | Nav links | Segmented Theme Switcher + Search + PDF + Presentation).
   - `src/components/learning/ModuleContent.tsx` & `src/App.tsx`: Nâng cấp bố cục học tập 3 cột tinh gọn, đồng bộ màu sắc thẻ, nút điều hướng trước/sau bài học.
3. **Data Visualizations & Simulations**:
   - `src/components/charts/*`: Đồng bộ màu sắc Dark/Light cho 4 biểu đồ kinh tế, căn chỉnh legend, tooltip và font chữ số `tabular-nums`.
   - `src/components/simulations/*`: Tinh chỉnh thanh trượt Cung - Cầu và máy tính công thức Karl Marx, loại bỏ viền thô và tăng độ phản hồi thị giác.
4. **All Interactive Modules**:
   - Cập nhật đồng bộ Dark Mode và Design System cho `HomeView`, `FlashcardDeck`, `QuizRunner`, `InteractiveMindmap`, `NotesManager`, `AnalyticsDashboard`, `ReferencesView`, `AiStudyAssistant`, `PdfViewerModal`, `SearchModal`, và `PresentationView`.
5. **Testing & Verification**:
   - Chạy TypeScript validation (`npm run lint`), build kiểm thử (`npm run build`), xác thực toàn bộ 20 test case từ TC01 đến TC20.
