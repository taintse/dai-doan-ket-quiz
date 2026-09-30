export const FOUR = [
  "Có điểm chung nào?",
  "Khác biệt có thể cùng tồn tại?",
  "Phản biện vấn đề hay công kích con người?",
  "Diễn đạt giúp tiếp tục hay đẩy xa hơn?",
] as const;

export const CLOSING =
  "Đoàn kết trên không gian mạng không bắt đầu từ việc nghĩ giống nhau, mà từ cách ứng xử khi không giống nhau.";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  q: string;
  choices: string[];
  answer: number;
  explain: string;
  difficulty: Difficulty;
}

/** Mỗi lượt rút bấy nhiêu câu, không lặp trong lượt. */
export const MATCH_EASY = 8;
export const MATCH_MEDIUM = 8;
export const MATCH_HARD = 4;
export const MATCH_SIZE = MATCH_EASY + MATCH_MEDIUM + MATCH_HARD;

export const QUESTIONS: Question[] = [
  {
    id: "q01",
    difficulty: "easy",
    q: "Theo Hồ Chí Minh, đại đoàn kết toàn dân tộc là chiến lược như thế nào?",
    choices: [
      "Tạm thời trong thời kỳ kháng chiến",
      "Chỉ dùng khi xây dựng chủ nghĩa xã hội",
      "Lâu dài, nhất quán",
      "Chỉ áp dụng ở đô thị",
    ],
    answer: 2,
    explain:
      "Đại đoàn kết là chiến lược lâu dài, nhất quán, duy trì cả trong cách mạng dân tộc dân chủ nhân dân và cách mạng xã hội chủ nghĩa.",
  },
  {
    id: "q02",
    difficulty: "easy",
    q: '"Đoàn kết, đoàn kết, đại đoàn kết; Thành công, thành công, ..." (điền vế còn thiếu)',
    choices: ["Đại thành công", "Đại thắng lợi", "Đại hạnh phúc", "Đại tự do"],
    answer: 0,
    explain: "",
  },
  {
    id: "q03",
    difficulty: "easy",
    q: "Nền tảng của khối đại đoàn kết toàn dân tộc là những lực lượng nào?",
    choices: [
      "Công nhân, tư sản, địa chủ",
      "Công nhân, nông dân, trí thức",
      "Nông dân, thương nhân, quân đội",
      "Trí thức, học sinh, nghệ sĩ",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q04",
    difficulty: "easy",
    q: "Hình thức tổ chức của khối đại đoàn kết toàn dân tộc là gì?",
    choices: ["Hội đồng nhân dân", "Liên đoàn lao động", "Mặt trận dân tộc thống nhất", "Quốc hội"],
    answer: 2,
    explain: "",
  },
  {
    id: "q05",
    difficulty: "easy",
    q: "Mặt trận Việt Minh được thành lập năm nào?",
    choices: ["1930", "1936", "1939", "1941"],
    answer: 3,
    explain: "",
  },
  {
    id: "q06",
    difficulty: "easy",
    q: "Mặt trận Liên Việt ra đời năm nào?",
    choices: ["1951", "1941", "1960", "1936"],
    answer: 0,
    explain: "",
  },
  {
    id: "q07",
    difficulty: "easy",
    q: "Chủ thể của khối đại đoàn kết toàn dân tộc là ai?",
    choices: [
      "Chỉ giai cấp công nhân",
      "Toàn thể nhân dân, mọi người Việt Nam yêu nước",
      "Chỉ đảng viên",
      "Chỉ người dân ở trong nước",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q08",
    difficulty: "easy",
    q: 'Chính sách đối ngoại Hồ Chí Minh tuyên bố: "làm bạn với tất cả mọi nước dân chủ và ..."',
    choices: ["Chỉ hợp tác kinh tế", "Ưu tiên các nước lớn", "Không gây thù oán với một ai", "Đóng cửa với bên ngoài"],
    answer: 2,
    explain: "",
  },
  {
    id: "q09",
    difficulty: "easy",
    q: "Cách mạng Tháng Mười Nga thắng lợi vào năm nào?",
    choices: ["1905", "1914", "1924", "1917"],
    answer: 3,
    explain: "",
  },
  {
    id: "q10",
    difficulty: "easy",
    q: 'Tinh thần "bốn phương vô sản đều là anh em" thể hiện sự đoàn kết giữa ai?',
    choices: [
      "Những người lao động trên toàn thế giới",
      "Các nước láng giềng",
      "Các doanh nghiệp quốc tế",
      "Các quân đội đồng minh",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q11",
    difficulty: "easy",
    q: 'Tiêu ngữ "Độc lập - Tự do - Hạnh phúc" gắn với sự kiện lịch sử nào?',
    choices: [
      "Chiến thắng Điện Biên Phủ 1954",
      "Sự ra đời nước Việt Nam Dân chủ Cộng hòa năm 1945",
      "Thống nhất đất nước 1975",
      "Đổi mới 1986",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q12",
    difficulty: "easy",
    q: "Nghị quyết 07/NQ-TW (2-11-1993) của Bộ Chính trị nói về vấn đề gì?",
    choices: [
      "Phát triển kinh tế thị trường",
      "Hội nhập quốc tế",
      "Đại đoàn kết dân tộc và tăng cường Mặt trận dân tộc thống nhất",
      "Xây dựng quân đội nhân dân",
    ],
    answer: 2,
    explain: "",
  },
  {
    id: "q13",
    difficulty: "easy",
    q: "Đại hội XII của Đảng (2016) khẳng định đại đoàn kết dân tộc là gì?",
    choices: [
      "Đường lối chiến lược của cách mạng Việt Nam",
      "Nhiệm vụ tạm thời",
      "Chính sách riêng của Mặt trận",
      "Biện pháp ngoại giao",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q14",
    difficulty: "easy",
    q: "Đảng Cộng sản Việt Nam giữ vai trò gì trong Mặt trận dân tộc thống nhất?",
    choices: [
      "Chỉ là thành viên",
      "Đứng ngoài giám sát",
      "Chỉ cung cấp tài chính",
      "Vừa là thành viên, vừa là lực lượng lãnh đạo",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q15",
    difficulty: "easy",
    q: 'Phương châm "cầu đồng tồn dị" có nghĩa là gì?',
    choices: [
      "Loại bỏ mọi khác biệt",
      "Lấy cái chung, hạn chế cái riêng, cái khác biệt",
      "Chỉ tôn trọng ý kiến số đông",
      "Tránh đối thoại với người khác quan điểm",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q16",
    difficulty: "easy",
    q: "Công đoàn, Hội Nông dân, Đoàn Thanh niên, Hội Phụ nữ thuộc loại tổ chức nào?",
    choices: ["Cơ quan nhà nước", "Tổ chức quân sự", "Đoàn thể, tổ chức quần chúng", "Tổ chức kinh tế"],
    answer: 2,
    explain: "",
  },
  {
    id: "q17",
    difficulty: "easy",
    q: "Điều nào sau đây là một trong ba điều kiện xây dựng khối đại đoàn kết toàn dân tộc?",
    choices: [
      "Sức mạnh quân sự vượt trội",
      "Lòng khoan dung, độ lượng với con người",
      "Viện trợ tài chính nước ngoài",
      "Phát triển kinh tế nhanh",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q18",
    difficulty: "easy",
    q: "Đại đoàn kết toàn dân tộc bao gồm cả ai?",
    choices: [
      "Chỉ người trong nước",
      "Chỉ người theo một tôn giáo",
      "Chỉ người cùng giai cấp",
      "Cả đồng bào trong nước và kiều bào ở nước ngoài",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q19",
    difficulty: "easy",
    q: "Năm 1924, Hồ Chí Minh đưa ra quan điểm thành lập mặt trận nào?",
    choices: [
      "Mặt trận thống nhất của nhân dân chính quốc và thuộc địa",
      "Mặt trận Việt Minh",
      "Mặt trận Liên Việt",
      "Mặt trận Tổ quốc Việt Nam",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q20",
    difficulty: "easy",
    q: "Tư tưởng đoàn kết vì thắng lợi cách mạng Việt Nam định hướng hình thành mấy tầng mặt trận?",
    choices: ["Hai", "Ba", "Bốn", "Năm"],
    answer: 2,
    explain:
      "Đại đoàn kết dân tộc; Việt Nam - Lào - Campuchia; nhân dân Á - Phi; nhân dân thế giới đoàn kết với Việt Nam.",
  },
  {
    id: "q21",
    difficulty: "medium",
    q: "Vì sao Hồ Chí Minh lấy liên minh công - nông làm nền tảng của Mặt trận?",
    choices: [
      "Vì họ giàu có nhất",
      "Vì họ trực tiếp sản xuất ra của cải, đông nhất, bị áp bức nặng nhất và chí khí cách mạng bền bỉ",
      "Vì họ nắm quyền lực chính trị",
      "Vì họ có trình độ học vấn cao nhất",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q22",
    difficulty: "medium",
    q: "Nguyên tắc hoạt động nào yêu cầu mọi vấn đề của Mặt trận được bàn bạc công khai để đi đến nhất trí?",
    choices: ["Tập trung dân chủ", "Hiệp thương dân chủ", "Đa số quyết định", "Lãnh đạo tuyệt đối"],
    answer: 1,
    explain: "",
  },
  {
    id: "q23",
    difficulty: "medium",
    q: 'Trong khối đại đoàn kết, yếu tố "hạt nhân" cần đặc biệt chú trọng là gì?',
    choices: [
      "Sức mạnh quân đội",
      "Nguồn lực kinh tế",
      "Sự đoàn kết và thống nhất trong Đảng",
      "Quan hệ ngoại giao",
    ],
    answer: 2,
    explain: "",
  },
  {
    id: "q24",
    difficulty: "medium",
    q: '"Mẫu số chung" để quy tụ các giai cấp, tầng lớp, đảng phái, dân tộc, tôn giáo vào Mặt trận là gì?',
    choices: [
      "Lợi ích của từng tầng lớp",
      "Lợi ích kinh tế",
      "Cùng một hệ tư tưởng",
      "Lợi ích tối cao của dân tộc, lợi ích căn bản của nhân dân lao động",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q25",
    difficulty: "medium",
    q: "Sự lãnh đạo của Đảng đối với Mặt trận thể hiện ở đâu?",
    choices: [
      "Áp đặt ý kiến lên các thành viên",
      "Nắm bắt thực tiễn, phát hiện quy luật khách quan để vạch đường lối và phương pháp cách mạng phù hợp",
      "Quyết định thay tất cả thành viên",
      "Chỉ nắm ngân sách hoạt động",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q26",
    difficulty: "medium",
    q: 'Theo Hồ Chí Minh, "đoàn kết thực sự" nghĩa là gì?',
    choices: [
      "Luôn nhất trí, không tranh luận",
      "Chỉ nghe theo người lãnh đạo",
      "Tránh phê bình để giữ hòa khí",
      "Vừa đoàn kết vừa đấu tranh, học cái tốt và phê bình cái sai của nhau trên lập trường thân ái",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q27",
    difficulty: "medium",
    q: "Sức mạnh dân tộc, trước hết, là sức mạnh của điều gì?",
    choices: [
      "Chủ nghĩa yêu nước và ý thức tự lực, tự cường dân tộc",
      "Vũ khí hiện đại",
      "Viện trợ nước ngoài",
      "Nguồn tài nguyên thiên nhiên",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q28",
    difficulty: "medium",
    q: 'Trong đoàn kết quốc tế, "có lý" nghĩa là gì?',
    choices: [
      "Chỉ dựa vào cảm xúc",
      "Tuân thủ nguyên tắc cơ bản của chủ nghĩa Mác - Lênin, xuất phát từ lợi ích chung, tránh giáo điều, rập khuôn",
      "Đặt lợi ích quốc gia mình lên trên hết",
      "Không cần nguyên tắc",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q29",
    difficulty: "medium",
    q: 'Trong đoàn kết quốc tế, "có tình" nghĩa là gì?',
    choices: [
      "Thông cảm, tôn trọng lẫn nhau giữa những người cùng lý tưởng, cùng mục tiêu đấu tranh",
      "Nhường nhịn mọi yêu cầu của nước khác",
      "Chỉ hợp tác khi có lợi",
      "Tránh mọi bất đồng",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q30",
    difficulty: "medium",
    q: "Tầng mặt trận nào sau đây KHÔNG nằm trong bốn tầng mặt trận theo tư tưởng Hồ Chí Minh?",
    choices: [
      "Mặt trận đoàn kết Việt Nam - Lào - Campuchia",
      "Mặt trận nhân dân Á - Phi đoàn kết với Việt Nam",
      "Mặt trận nhân dân thế giới đoàn kết với Việt Nam",
      "Mặt trận liên minh quân sự châu Âu",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q31",
    difficulty: "medium",
    q: 'Theo nguyên tắc "đoàn kết trên cơ sở độc lập, tự chủ", yếu tố nào quyết định?',
    choices: ["Ngoại lực", "Viện trợ quốc tế", "Nội lực", "Sự đồng thuận của nước lớn"],
    answer: 2,
    explain: "Nguồn lực bên ngoài chỉ phát huy tác dụng thông qua nội lực.",
  },
  {
    id: "q32",
    difficulty: "medium",
    q: "Đại hội IX của Đảng xác định Việt Nam là gì trong quan hệ quốc tế?",
    choices: ["Muốn là bạn", "Sẵn sàng là bạn", "Là đồng minh quân sự", "Là bạn và đối tác tin cậy"],
    answer: 3,
    explain: 'VII: "muốn là bạn"; VIII: "sẵn sàng là bạn"; IX: "là bạn và đối tác tin cậy".',
  },
  {
    id: "q33",
    difficulty: "medium",
    q: "Mặt trận nào được thành lập năm 1936?",
    choices: ["Mặt trận dân chủ", "Hội Phản đế đồng minh", "Mặt trận nhân dân phản đế", "Mặt trận Liên Việt"],
    answer: 0,
    explain: "",
  },
  {
    id: "q34",
    difficulty: "medium",
    q: "Mặt trận dân tộc giải phóng miền Nam Việt Nam ra đời năm nào?",
    choices: ["1954", "1960", "1965", "1975"],
    answer: 1,
    explain: "",
  },
  {
    id: "q35",
    difficulty: "medium",
    q: "Vì sao cần đoàn kết giai cấp công nhân quốc tế?",
    choices: [
      "Vì chủ nghĩa tư bản là lực lượng phản động quốc tế, kẻ thù chung của nhân dân lao động toàn thế giới",
      "Vì mọi nước đều có chung thể chế",
      "Vì để trao đổi thương mại",
      "Vì để tránh cạnh tranh",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q36",
    difficulty: "medium",
    q: "Hoạt động nào của Hồ Chí Minh góp phần đặt cơ sở cho Mặt trận nhân dân Á - Phi đoàn kết với Việt Nam?",
    choices: [
      "Thành lập Đảng Cộng sản Đông Dương",
      "Sáng lập Hội Liên hiệp thuộc địa ở Pháp và tham gia sáng lập Hội Liên hiệp các dân tộc bị áp bức ở Trung Quốc",
      "Soạn Tuyên ngôn Độc lập",
      "Thành lập Mặt trận Liên Việt",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q37",
    difficulty: "medium",
    q: "Nền hòa bình mà Hồ Chí Minh đấu tranh là hòa bình như thế nào?",
    choices: [
      "Hòa bình bằng mọi giá",
      "Hòa bình do nước lớn áp đặt",
      "Hòa bình trong độc lập, tự do, xây trên công bằng và dân chủ",
      "Hòa bình tạm thời",
    ],
    answer: 2,
    explain: "",
  },
  {
    id: "q38",
    difficulty: "medium",
    q: "Việc vận hành theo hiệp thương dân chủ nhằm loại trừ điều gì?",
    choices: ["Mọi bất đồng", "Sự tham gia của các tôn giáo", "Lợi ích riêng chính đáng", "Mọi sự áp đặt hoặc dân chủ hình thức"],
    answer: 3,
    explain: "",
  },
  {
    id: "q39",
    difficulty: "medium",
    q: "Giải pháp nào sau đây nằm trong việc tăng cường khối đại đoàn kết hiện nay?",
    choices: [
      "Giải quyết tốt quan hệ lợi ích giữa các giai cấp, tầng lớp; kết hợp hài hòa lợi ích cá nhân, tập thể và toàn xã hội",
      "Hạn chế hoạt động của Mặt trận",
      "Ưu tiên lợi ích một nhóm",
      "Giảm vai trò của Nhà nước",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q40",
    difficulty: "medium",
    q: "Một bài học về đoàn kết quốc tế được vận dụng hiện nay là gì?",
    choices: [
      "Tự cô lập để tự lực",
      "Chỉ hợp tác với một khối nước",
      "Từ bỏ độc lập, tự chủ",
      "Mở cửa, hội nhập quốc tế, là bạn của tất cả các nước, đồng thời tham gia giải quyết các vấn đề toàn cầu",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q41",
    difficulty: "hard",
    q: "Mối quan hệ biện chứng nào sau đây được rút ra từ thực tiễn lịch sử?",
    choices: [
      "Mặt trận càng rộng rãi thì liên minh công - nông - trí càng mạnh, sự lãnh đạo của Đảng càng vững; và ngược lại",
      "Mặt trận càng rộng thì vai trò của Đảng càng giảm",
      "Liên minh công - nông - trí và Mặt trận độc lập với nhau",
      "Đảng càng mạnh thì Mặt trận càng hẹp",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q42",
    difficulty: "hard",
    q: "Vì sao chính sách, phương pháp tập hợp có thể điều chỉnh nhưng không được thay đổi chủ trương đại đoàn kết toàn dân tộc?",
    choices: [
      "Vì chủ trương này do cấp trên quy định",
      "Vì chính sách và phương pháp không quan trọng",
      "Vì đây là nhân tố quyết định sự thành bại của cách mạng",
      "Vì tránh thay đổi nhân sự",
    ],
    answer: 2,
    explain: "",
  },
  {
    id: "q43",
    difficulty: "hard",
    q: 'Khái niệm "nhân dân" là chủ thể của khối đại đoàn kết được hiểu như thế nào?',
    choices: [
      "Chỉ là tập hợp đông đảo quần chúng",
      "Chỉ là từng con người cụ thể",
      "Chỉ là giai cấp công nhân",
      "Vừa là con người Việt Nam cụ thể, vừa là tập hợp đông đảo quần chúng nhân dân",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q44",
    difficulty: "hard",
    q: "Vì sao muốn tranh thủ được sự ủng hộ quốc tế, Đảng phải có đường lối độc lập, tự chủ và đúng đắn?",
    choices: [
      "Vì bên ngoài luôn từ chối giúp đỡ nước yếu",
      "Vì ngoại lực chỉ phát huy tác dụng thông qua nội lực; đường lối đúng mới tạo được niềm tin và sự ủng hộ",
      "Vì chỉ cần dựa vào ngoại lực",
      "Vì để không phải hợp tác với ai",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q45",
    difficulty: "hard",
    q: "Vì sao sự lãnh đạo của Đảng không mâu thuẫn với tính rộng rãi của Mặt trận?",
    choices: [
      "Vì Đảng có quyền quyết định mọi việc",
      "Vì Đảng loại bỏ các ý kiến khác",
      "Vì Đảng không có lợi ích riêng, lợi ích của Đảng gắn liền với lợi ích toàn xã hội, toàn dân tộc",
      "Vì Đảng chỉ đại diện cho một giai cấp",
    ],
    answer: 2,
    explain: "",
  },
  {
    id: "q46",
    difficulty: "hard",
    q: '"Sức mạnh thời đại" trong tư tưởng Hồ Chí Minh gồm những gì?',
    choices: [
      "Chỉ sức mạnh quân sự của các nước lớn",
      "Chỉ sức mạnh kinh tế toàn cầu",
      "Chỉ viện trợ của Liên Hợp Quốc",
      "Sức mạnh của phong trào cách mạng thế giới và chủ nghĩa Mác - Lênin, được xác lập bởi thắng lợi của Cách mạng Tháng Mười Nga 1917",
    ],
    answer: 3,
    explain: "",
  },
  {
    id: "q47",
    difficulty: "hard",
    q: "Quan hệ giữa đại đoàn kết toàn dân tộc và đoàn kết quốc tế được xác định như thế nào?",
    choices: [
      "Hai vấn đề hoàn toàn tách rời",
      "Đại đoàn kết toàn dân tộc là cơ sở cho việc thực hiện đoàn kết quốc tế, và hai việc phải gắn liền với nhau",
      "Đoàn kết quốc tế là cơ sở của đại đoàn kết dân tộc",
      "Chỉ cần đoàn kết quốc tế là đủ",
    ],
    answer: 1,
    explain: "",
  },
  {
    id: "q48",
    difficulty: "hard",
    q: 'Vì sao cần làm cho "đội quân tiên phong của lao động thuộc địa tiếp xúc mật thiết với giai cấp vô sản phương Tây"?',
    choices: [
      "Để dọn đường cho một sự hợp tác thật sự, bảo đảm cho giai cấp công nhân quốc tế giành thắng lợi cuối cùng",
      "Để thay thế vai trò của giai cấp vô sản phương Tây",
      "Để xin viện trợ quân sự",
      "Để tách cách mạng thuộc địa khỏi chính quốc",
    ],
    answer: 0,
    explain: "",
  },
  {
    id: "q49",
    difficulty: "hard",
    q: "Sắp xếp đúng trình tự thời gian các tên gọi của Mặt trận dân tộc thống nhất:",
    choices: [
      "Việt Minh → Hội Phản đế đồng minh → Liên Việt → Mặt trận dân tộc giải phóng miền Nam",
      "Hội Phản đế đồng minh → Việt Minh → Liên Việt → Mặt trận dân tộc giải phóng miền Nam",
      "Liên Việt → Hội Phản đế đồng minh → Việt Minh → Mặt trận dân tộc giải phóng miền Nam",
      "Hội Phản đế đồng minh → Liên Việt → Việt Minh → Mặt trận dân tộc giải phóng miền Nam",
    ],
    answer: 1,
    explain: "1930 → 1941 → 1951 → 1960.",
  },
  {
    id: "q50",
    difficulty: "hard",
    q: "Sắp xếp đúng trình tự các mốc vận dụng của Đảng về đại đoàn kết và đối ngoại:",
    choices: [
      "Nghị quyết 07/NQ-TW (1993) → Đại hội VIII (1996) → Đại hội IX → Đại hội XII (2016)",
      "Đại hội XII (2016) → Nghị quyết 07/NQ-TW (1993) → Đại hội VIII (1996) → Đại hội IX",
      "Đại hội VIII (1996) → Nghị quyết 07/NQ-TW (1993) → Đại hội IX → Đại hội XII (2016)",
      "Nghị quyết 07/NQ-TW (1993) → Đại hội IX → Đại hội VIII (1996) → Đại hội XII (2016)",
    ],
    answer: 0,
    explain: "",
  },
];

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Dễ",
  medium: "Vừa",
  hard: "Khó",
};

export function difficultyLabel(d: Difficulty): string {
  return DIFFICULTY_LABEL[d];
}

function shuffle<T>(list: T[], random: () => number) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const tmp = list[i];
    list[i] = list[j];
    list[j] = tmp;
  }
  return list;
}

function take(pool: Question[], n: number, random: () => number): Question[] {
  const copy = pool.map((q) => ({ ...q, choices: [...q.choices] }));
  shuffle(copy, random);
  return copy.slice(0, Math.min(n, copy.length));
}

/** Rút 8 dễ / 8 vừa / 4 khó. Nếu một mức thiếu thì bù từ phần còn lại, rồi xáo. */
export function buildMatchDeck(random: () => number): Question[] {
  const groups: Record<Difficulty, Question[]> = { easy: [], medium: [], hard: [] };
  for (const q of QUESTIONS) groups[q.difficulty].push(q);
  const picked = [
    ...take(groups.easy, MATCH_EASY, random),
    ...take(groups.medium, MATCH_MEDIUM, random),
    ...take(groups.hard, MATCH_HARD, random),
  ];
  if (picked.length < MATCH_SIZE) {
    const used = new Set(picked.map((q) => q.id));
    const rest = shuffle(
      QUESTIONS.filter((q) => !used.has(q.id)).map((q) => ({ ...q, choices: [...q.choices] })),
      random,
    );
    for (const q of rest) {
      if (picked.length >= MATCH_SIZE) break;
      picked.push(q);
    }
  }
  return shuffle(picked, random);
}

QUESTIONS.forEach((q) => {
  if (q.choices.length !== 4 || q.answer < 0 || q.answer > 3) {
    throw new Error("Đáp án lệch: " + q.id);
  }
});

{
  const counts: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  const ids = new Set<string>();
  for (const q of QUESTIONS) {
    if (ids.has(q.id)) throw new Error("Trùng id: " + q.id);
    ids.add(q.id);
    counts[q.difficulty]++;
  }
  if (QUESTIONS.length !== 50 || counts.easy !== 20 || counts.medium !== 20 || counts.hard !== 10) {
    throw new Error("Ngân hàng phải đủ 20 dễ, 20 vừa, 10 khó");
  }
}
