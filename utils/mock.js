const mockItems = [
  {
    content: "不知道外面还下雨不",
    contentId: 57,
    createdAt: "2025-08-14T20:01:41+08:00",
    familiar: 0,
    id: 57,
    target: "I wonder if it’s still raining out there.",
    times: 0,
    updatedAt: "2025-08-14T20:01:41+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "你吃了吗？",
    contentId: 58,
    createdAt: "2025-08-14T20:02:10+08:00",
    familiar: 1,
    id: 58,
    target: "Have you eaten?",
    times: 2,
    updatedAt: "2025-08-14T20:02:10+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "今天天气真好。",
    contentId: 59,
    createdAt: "2025-08-14T20:03:00+08:00",
    familiar: 0,
    id: 59,
    target: "The weather is really nice today.",
    times: 0,
    updatedAt: "2025-08-14T20:03:00+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "你去哪儿？",
    contentId: 60,
    createdAt: "2025-08-14T20:04:15+08:00",
    familiar: 0,
    id: 60,
    target: "Where are you going?",
    times: 1,
    updatedAt: "2025-08-14T20:04:15+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "我们一起去吧。",
    contentId: 61,
    createdAt: "2025-08-14T20:05:22+08:00",
    familiar: 0,
    id: 61,
    target: "Let's go together.",
    times: 0,
    updatedAt: "2025-08-14T20:05:22+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "这个多少钱？",
    contentId: 62,
    createdAt: "2025-08-14T20:06:30+08:00",
    familiar: 0,
    id: 62,
    target: "How much is this?",
    times: 0,
    updatedAt: "2025-08-14T20:06:30+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "我不太明白。",
    contentId: 63,
    createdAt: "2025-08-14T20:07:45+08:00",
    familiar: 0,
    id: 63,
    target: "I don't quite understand.",
    times: 0,
    updatedAt: "2025-08-14T20:07:45+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "你会说英语吗？",
    contentId: 64,
    createdAt: "2025-08-14T20:08:50+08:00",
    familiar: 0,
    id: 64,
    target: "Can you speak English?",
    times: 0,
    updatedAt: "2025-08-14T20:08:50+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "请再说一遍。",
    contentId: 65,
    createdAt: "2025-08-14T20:09:55+08:00",
    familiar: 0,
    id: 65,
    target: "Please say it again.",
    times: 0,
    updatedAt: "2025-08-14T20:09:55+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  },
  {
    content: "没关系，谢谢。",
    contentId: 66,
    createdAt: "2025-08-14T20:10:30+08:00",
    familiar: 0,
    id: 66,
    target: "No problem, thanks.",
    times: 0,
    updatedAt: "2025-08-14T20:10:30+08:00",
    userId: 370,
    voiceFemale: "",
    voiceMale: "",
    __preset_item: true
  }
]

function getMockItems () {
  return mockItems.slice()
}

function pendPresetItems (items = []) {
  // Ensure we work with an array copy
  if (!Array.isArray(items)) items = []
  const result = items.slice()
  if (result.length >= 4) return result
  // If original items are less than 4, append all mock items
  return result.concat(mockItems.slice())
}

module.exports = {
  getMockItems,
  mockItems,
  pendPresetItems
}

