import type { VirusId } from "./balance";

/** Extra HP while a marked virus has not been chiếu sáng. */
export const MARK_HP = 1.7;
export const MARK_BUDGET = 6.5;

export const TEASERS: Record<VirusId, { title: string; text: string }> = {
  tin: {
    title: "Tin giả mang bài",
    text: "Lời không nguồn đang đi vào hàng. Huy hiệu Có bài hiện thì bấm virus, hoặc nút Câu hỏi. Đúng: máu tụt mạnh và nó chậm lại. Bỏ qua: nó rất trâu.",
  },
  congkich: {
    title: "Công kích mang bài",
    text: "Nó nhắm vào người, không nhắm vào việc. Một câu đúng làm giáp nứt. Lờ đi, nó vẫn nhanh và dai.",
  },
  echo: {
    title: "Buồng vọng mang bài",
    text: "Một phía được lặp lại cho đến khi cả hàng chỉ còn một tiếng. Chiếu sáng thì lớp vọng mỏng, máu giảm rõ. Không trả lời, bức tường chậm ấy vẫn dày.",
  },
  spam: {
    title: "Spam thù mang bài",
    text: "Bầy tin ngắn, ồn, dễ nuốt mất chuyện chung. Con mang bài được chiếu sáng sẽ gục gần nửa máu. Bỏ qua, tiếng ồn vẫn dày.",
  },
  kichdong: {
    title: "Kích động mang bài",
    text: "Nó kéo virus cùng hàng chạy nhanh hơn. Câu đúng làm nó khựng và mất phần lớn máu. Không chiếu sáng, nó càng hung.",
  },
};

/** Ids đã có trong ngân hàng câu — không bịa mệnh đề giáo trình mới. */
export const MARK_POOL: Record<VirusId, string[]> = {
  tin: ["rumor", "subject", "strategy"],
  congkich: ["fingers", "critique", "bridge"],
  echo: ["cau", "four", "principles"],
  spam: ["limit", "rumor", "interest"],
  kichdong: ["limit", "message", "interest"],
};
