export const FOUR = [
  "Có điểm chung nào?",
  "Khác biệt có thể cùng tồn tại?",
  "Phản biện vấn đề hay công kích con người?",
  "Diễn đạt giúp tiếp tục hay đẩy xa hơn?",
] as const;

export const CLOSING =
  "Đoàn kết trên không gian mạng không bắt đầu từ việc nghĩ giống nhau, mà từ cách ứng xử khi không giống nhau.";

export type QuestionTag = "lesson" | "clutch" | "skill";

export interface Question {
  id: string;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  source: string;
  tags: QuestionTag[];
}

/** Câu đã có trong bài — không thêm nhận định giáo trình mới. */
export const QUESTIONS: Question[] = [
  {
    id: "strategy",
    q: "Theo Tư tưởng Hồ Chí Minh, đại đoàn kết toàn dân tộc mang tính chất nào?",
    choices: [
      "Chỉ là giải pháp tạm thời khi gặp khó khăn lớn",
      "Là chiến lược lâu dài, xuyên suốt quá trình cách mạng",
      "Chỉ đúng trong thời kỳ kháng chiến",
      "Là khẩu hiệu tuyên truyền, không phải nguyên tắc nền tảng",
    ],
    answer: 1,
    explain: "Đại đoàn kết là chiến lược lâu dài, không phải sách lược nhất thời.",
    source: "Giáo trình TT HCM 2021, Chương V, I.1.a (tr.97–99).",
    tags: ["lesson", "skill"],
  },
  {
    id: "subject",
    q: "Chủ thể của đại đoàn kết chỉ gồm những người có cùng tư tưởng, cùng quan điểm.",
    choices: ["Đúng", "Sai"],
    answer: 1,
    explain: "Sai. Chủ thể rất rộng — toàn dân — không chỉ những người nghĩ giống mình.",
    source: "Giáo trình TT HCM 2021, Chương V, I.2.a (tr.100).",
    tags: ["lesson", "skill"],
  },
  {
    id: "interest",
    q: "Điểm tập hợp lực lượng trong đại đoàn kết dựa trên yếu tố nào?",
    choices: [
      "Buộc mọi người từ bỏ mọi khác biệt",
      "Lợi ích chung, đồng thời tôn trọng khác biệt chính đáng",
      "Chỉ lợi ích trước mắt của nhóm đang mạnh hơn",
      "Chỉ những người vốn đã giống nhau",
    ],
    answer: 1,
    explain: "Điểm quy tụ là lợi ích chung, và vẫn còn chỗ cho khác biệt chính đáng.",
    source: "Giáo trình TT HCM 2021, Chương V, I.3 (tr.101–103).",
    tags: ["lesson", "skill"],
  },
  {
    id: "fingers",
    q: "Hình ảnh năm ngón tay gợi điều gì về thái độ với con người?",
    choices: [
      "Loại người khác biệt như loại một ngón thừa",
      "Khoan dung: phê phán việc làm, không công kích cá nhân",
      "Chỉ đoàn kết với người giống mình",
      "Khác biệt không cần tôn trọng khi đang vội",
    ],
    answer: 1,
    explain: "Ngón vắn ngón dài vẫn một bàn tay. Phản biện vấn đề, không phủ nhận người.",
    source: "Cùng mạch Giáo trình TT HCM 2021, Chương V, I.3 (tr.101–103).",
    tags: ["lesson", "clutch", "skill"],
  },
  {
    id: "cau",
    q: "Cầu đồng tồn dị nghĩa là gì?",
    choices: [
      "Tìm điểm chung rồi bắt mọi người phải giống nhau",
      "Bỏ qua mọi khác biệt, kể cả khác biệt gây hại",
      "Tìm điểm chung, để khác biệt chính đáng cùng tồn tại",
      "Tránh mọi tranh luận cho êm bề mặt",
    ],
    answer: 2,
    explain: "Chủ động tìm chỗ giống nhau, và chấp nhận khác biệt chính đáng cùng tồn tại.",
    source: "Giáo trình TT HCM 2021, Chương V, I.4.b (tr.103–104).",
    tags: ["lesson", "skill"],
  },
  {
    id: "bridge",
    q: "Một bạn trong nhóm bất đồng với hướng bài. Cách nào gần cầu đồng tồn dị hơn?",
    choices: [
      "Không đồng ý thì rời nhóm",
      "Im lặng cho xong việc",
      "Tìm việc chung, phản biện nội dung, giữ người ở lại cuộc nói",
      "Công kích cá nhân để thắng cuộc tranh luận",
    ],
    answer: 2,
    explain: "Gọi tên điểm chung, góp vào ý, không đẩy người ra.",
    source: "Tinh thần I.4.b (tr.103–104).",
    tags: ["clutch", "skill"],
  },
  {
    id: "four",
    q: "Bốn câu tự kiểm trước khi bình luận (điểm chung, khác biệt, phản biện hay công kích, lời nói nối hay đẩy) là gì?",
    choices: [
      "Nguyên văn trong Giáo trình Tư tưởng Hồ Chí Minh 2021",
      "Vận dụng của nhóm — không phải nguyên văn giáo trình",
      "Bốn điều khoản luật về bình luận trên mạng",
      "Bốn câu Bác Hồ viết đúng từng chữ cho không gian mạng",
    ],
    answer: 1,
    explain: "Đây là vận dụng của nhóm, rút từ tinh thần đại đoàn kết, để dùng trước khi gõ.",
    source: "Vận dụng của nhóm — không phải nguyên văn giáo trình.",
    tags: ["lesson", "skill"],
  },
  {
    id: "limit",
    q: "Đại đoàn kết có nghĩa là bỏ qua mọi mâu thuẫn, không đấu tranh với hành vi chia rẽ.",
    choices: ["Đúng", "Sai"],
    answer: 1,
    explain: "Sai. Khoan dung với con người không có nghĩa là làm ngơ trước hành vi chia rẽ cộng đồng.",
    source: "Giáo trình TT HCM 2021, Chương V, III.2 (tr.114–115).",
    tags: ["lesson", "clutch", "skill"],
  },
  {
    id: "rumor",
    q: "Một tin không nguồn đang tách lớp theo vùng miền. Cách ứng xử nào đúng tinh thần đại đoàn kết?",
    choices: [
      "Im lặng vì đoàn kết là không tranh cãi",
      "Công kích người đã đăng tin",
      "Bác nội dung sai, giữ nhân phẩm, kéo về việc chung của lớp",
      "Rời diễn đàn cho khỏi liên lụy",
    ],
    answer: 2,
    explain: "Đấu tranh với hành vi chia rẽ, và không biến cuộc đấu tranh thành công kích người.",
    source: "III.2 (tr.114–115). Bốn câu tự kiểm là vận dụng của nhóm.",
    tags: ["clutch", "skill"],
  },
  {
    id: "principles",
    q: "Nguyên tắc kết của nhóm gồm những nội dung nào?",
    choices: [
      "Chỉ tìm điểm chung, bỏ qua mọi khác biệt",
      "Tìm điểm chung – tôn trọng khác biệt – phản biện vấn đề – không công kích con người – trách nhiệm với cộng đồng",
      "Thắng mọi tranh luận bằng mọi giá",
      "Chỉ trách nhiệm với bản thân",
    ],
    answer: 1,
    explain: "Năm nhịp ấy đi cùng nhau trong cách ứng xử trên mạng.",
    source: "Nguyên tắc kết của nhóm — vận dụng, không phải nguyên văn giáo trình.",
    tags: ["lesson", "skill"],
  },
  {
    id: "message",
    q: "Thông điệp kết nào đúng với tinh thần bài thuyết trình?",
    choices: [
      "Đoàn kết trên mạng bắt đầu từ việc mọi người phải nghĩ giống nhau.",
      CLOSING,
      "Trên mạng không cần đoàn kết.",
      "Chỉ đoàn kết với người cùng quan điểm.",
    ],
    answer: 1,
    explain: "Đoàn kết bắt đầu từ cách ứng xử khi người ta không giống nhau.",
    source: "Thông điệp kết của nhóm.",
    tags: ["lesson", "skill"],
  },
  {
    id: "critique",
    q: "Một góp ý gay vào ý tưởng, không xúc phạm ai. Cách phù hợp nhất?",
    choices: [
      "Coi đó là công kích và đáp trả tương tự",
      "Phản hồi nội dung, làm rõ điểm chung, giữ tôn trọng",
      "Xóa góp ý vì cho rằng góp ý gay là phá đoàn kết",
      "Bỏ bài vì có người không đồng ý",
    ],
    answer: 1,
    explain: "Phê phán ý khác với công kích người. Hãy trả lời vào nội dung.",
    source: "Tinh thần I.3 và I.4.b, cùng nguyên tắc của nhóm.",
    tags: ["clutch", "skill"],
  },
];

export const FORCED_IDS = ["strategy", "cau", "limit", "message"] as const;

QUESTIONS.forEach((q) => {
  if (q.answer < 0 || q.answer >= q.choices.length) {
    throw new Error("Đáp án lệch: " + q.id);
  }
});
