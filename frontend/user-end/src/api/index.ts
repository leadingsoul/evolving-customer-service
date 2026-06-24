import { get, post, put } from './request'
import type {
  UserInfo, Order, OrderDetail, ChatSession, ChatMessage,
  IntentResult, AftersaleTicket, Evaluation, Notice,
  PaginatedResponse
} from '@/types'

// ============ Auth ============
export const authApi = {
  wechatLogin: (code: string) =>
    post<{ token: string; userInfo: UserInfo }>('/auth/wechat-login', { code }),

  bindPhone: (phone: string) =>
    post<void>('/user/bind-phone', { phone }),

  linkPlatform: (platformType: string, openId: string) =>
    post<void>('/user/link-platform', { platformType, openId }),
}

// ============ User ============
export const userApi = {
  getProfile: () => get<UserInfo>('/user/profile'),
  updateProfile: (data: Partial<UserInfo>) => put<UserInfo>('/user/profile', data),
}

// ============ Order ============
export const orderApi = {
  list: (status?: string, page = 1, size = 10) =>
    get<PaginatedResponse<Order>>('/order/list', { status, page, size }),

  detail: (orderId: string) =>
    get<OrderDetail>(`/order/detail/${orderId}`),
}

// ============ Chat ============
export const chatApi = {
  sendMessage: (sessionId: string, content: string, images?: string[]) =>
    post<{ reply: string; sessionId: string; level: string }>('/chat/message', { sessionId, content, images }),

  getHistory: (sessionId: string, page = 1, size = 20) =>
    get<{ messages: ChatMessage[]; hasMore: boolean }>(`/chat/history/${sessionId}`, { page, size }),

  getIntent: (text: string, sessionId?: string) =>
    post<IntentResult>('/ai/intent/recognize', { text, sessionId }),

  getSessions: (page = 1, size = 10) =>
    get<PaginatedResponse<ChatSession>>('/chat/sessions', { page, size }),
}

// ============ Aftersale ============
export const aftersaleApi = {
  apply: (data: {
    orderId: string
    type: string
    reason: string
    description: string
    imageUrls: string[]
  }) => post<{ ticketId: string }>('/aftersaleticket', data),

  listByUser: (status?: string, page = 1, size = 10) =>
    get<PaginatedResponse<AftersaleTicket>>('/aftersaleticket/list', { status, page, size }),

  detail: (ticketId: string) =>
    get<AftersaleTicket>(`/aftersaleticket/detail/${ticketId}`),

  cancel: (ticketId: string) =>
    post<void>(`/aftersaleticket/${ticketId}/cancel`),

  supplement: (ticketId: string, imageUrls: string[]) =>
    post<void>(`/aftersaleticket/${ticketId}/supplement`, { imageUrls }),
}

// ============ Evaluate ============
export const evaluateApi = {
  submit: (data: {
    orderId: string
    scoreProduct: number
    scoreLogistics: number
    scoreService: number
    content?: string
    imageUrls?: string[]
    isAnonymous?: boolean
  }) => post<{ evalId: string }>('/evaluation', data),

  pendingList: (page = 1, size = 10) =>
    get<PaginatedResponse<Order>>('/evaluation/pending', { page, size }),

  myList: (page = 1, size = 10) =>
    get<PaginatedResponse<Evaluation>>('/evaluation/my', { page, size }),

  append: (parentEvalId: string, content: string, imageUrls?: string[]) =>
    post<void>('/evaluation/append', { parentEvalId, content, imageUrls }),

  modify: (evalId: string, data: Partial<Evaluation>) =>
    put<Evaluation>(`/evaluation/${evalId}`, data),
}

// ============ Notice ============
export const noticeApi = {
  list: (page = 1, size = 10) =>
    get<PaginatedResponse<Notice>>('/notice/list', { page, size }),

  unreadCount: () =>
    get<{ count: number }>('/notice/unread-count'),

  markAsRead: (ids: number[]) =>
    post<void>('/notice/read', { ids }),
}

// ============ Feedback ============
export const feedbackApi = {
  submit: (content: string, contact?: string) =>
    post<void>('/feedback', { content, contact }),
}
