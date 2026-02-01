// frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  image_url?: string
  published: boolean
  category: Category
  tags: Tag[]
  author: User
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  username: string
  email: string
  display_name?: string
  avatar?: string
  bio?: string
  is_admin?: boolean
}

export interface Comment {
  id: number
  content: string
  author: string  // バックエンドはauthorがstring型
  email: string
  approved: boolean
  created_at: string
  post_id: number
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// エラーハンドリング用ユーティリティ
class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// リクエストヘルパー
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        // JSONパース失敗時はそのまま
      }
      throw new ApiError(errorMessage, response.status)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error')
  }
}

export async function getPosts(params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
}): Promise<Post[]> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.category) queryParams.set('category', params.category)
  if (params?.tag) queryParams.set('tag', params.tag)
  if (params?.search) queryParams.set('search', params.search)
  
  const queryString = queryParams.toString()
  const endpoint = `/api/posts${queryString ? `?${queryString}` : ''}`
  
  const response = await fetchApi<ApiResponse<Post[]>>(endpoint)
  return response.data || []
}

export async function getPost(slugOrId: string | number): Promise<Post> {
  // スラッグかIDかを判定
  const isSlug = typeof slugOrId === 'string' && !/^\d+$/.test(slugOrId)
  
  if (isSlug) {
    const response = await fetchApi<ApiResponse<Post>>(`/api/posts/slug/${slugOrId}`)
    return response.data!
  } else {
    const response = await fetchApi<ApiResponse<Post>>(`/api/posts/${slugOrId}`)
    return response.data!
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetchApi<ApiResponse<Category[]>>('/api/categories')
  return response.data || []
}

export async function getTags(): Promise<Tag[]> {
  const response = await fetchApi<ApiResponse<Tag[]>>('/api/tags')
  return response.data || []
}

export async function getComments(postId: number): Promise<Comment[]> {
  const response = await fetchApi<ApiResponse<Comment[]>>(`/api/posts/${postId}/comments`)
  return response.data || []
}

export async function createComment(postId: number, commentData: {
  author: string
  email: string
  content: string
}): Promise<Comment> {
  const response = await fetchApi<ApiResponse<Comment>>('/api/comments', {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      ...commentData
    }),
  })
  return response.data!
}

export async function searchPosts(query: string): Promise<Post[]> {
  const response = await fetchApi<ApiResponse<Post[]>>(`/api/search?q=${encodeURIComponent(query)}`)
  return response.data || []
}

// 認証関連のAPI
export async function login(credentials: {
  email: string
  password: string
}): Promise<{ token: string; user: User }> {
  const response = await fetchApi<{ token: string; user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return response
}

export async function register(userData: {
  email: string
  username: string
  password: string
  display_name?: string
}): Promise<{ token: string; user: User }> {
  const response = await fetchApi<{ token: string; user: User }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
  return response
}

export async function getCurrentUser(token?: string): Promise<User> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetchApi<ApiResponse<User>>('/api/auth/me', {
    headers,
  })
  return response.data!
}
