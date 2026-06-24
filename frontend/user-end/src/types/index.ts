/** 用户信息 */
export interface UserInfo {
  id: number
  openid: string
  nickname: string
  avatarUrl: string
  phone: string
  platformBindings?: Record<string, string>
  createdAt: string
  status: number
}

/** 订单 */
export interface Order {
  id: string
  orderSn: string
  status: '进行中' | '已完成' | '售后中' | '已取消'
  totalAmount: number
  productName: string
  productImage: string
  createdAt: string
  finishedAt?: string
}

/** 订单详情 */
export interface OrderDetail extends Order {
  productSpec: string
  quantity: number
  logisticsInfo?: LogisticsInfo
}

/** 物流信息 */
export interface LogisticsInfo {
  company: string
  trackingNo: string
  status: string
  traces: LogisticsTrace[]
}

export interface LogisticsTrace {
  time: string
  status: string
  description: string
}

/** 会话 */
export interface ChatSession {
  id: string
  userId: number
  agentId?: number
  startAt: string
  endAt?: string
  intent?: string
  confidence?: number
  level?: 'L1' | 'L2' | 'L3'
  lastMessage?: string
  lastMessageTime?: string
}

/** 聊天消息 */
export interface ChatMessage {
  id: number
  sessionId: string
  role: 'user' | 'agent' | 'ai'
  content: string
  imageUrls?: string[]
  sentAt: string
}

/** 意图识别结果 */
export interface IntentResult {
  intent: string
  confidence: number
  slots: Record<string, string>
}

/** 售后工单 */
export interface AftersaleTicket {
  id: string
  orderId: string
  type: '仅退款' | '退货退款' | '换货' | '维修'
  reason: '质量问题' | '发错货' | '物流问题' | '七天无理由' | '描述不符' | '其他'
  description: string
  evidenceUrls: string[]
  status: '待审核' | '审核通过' | '处理中' | '已完成' | '已拒绝'
  handleOpinion?: string
  aiType?: string
  aiUrgency?: 'high' | 'medium' | 'low'
  createdAt: string
  updatedAt: string
  orderInfo?: Order
}

/** 评价 */
export interface Evaluation {
  id: string
  orderId: string
  scoreProduct: number
  scoreLogistics: number
  scoreService: number
  content: string
  imageUrls: string[]
  isAnonymous: boolean
  createdAt: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  topics?: string[]
  orderInfo?: Order
}

/** 通知消息 */
export interface Notice {
  id: number
  title: string
  content: string
  type: 'system' | 'aftersale' | 'service'
  isRead: boolean
  createdAt: string
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}

/** API统一响应 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  traceId: string
}
