const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  category: Category
  tags: Tag[]
  author: User
  createdAt: string
  updatedAt: string
  readTime?: string
  featured?: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  postCount?: number
}

export interface Tag {
  id: number
  name: string
  slug: string
  postCount?: number
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface Comment {
  id: number
  content: string
  author: User
  createdAt: string
  postId: number
  parentId?: number
  replies?: Comment[]
}

export interface ApiResponse<T> {
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function getPosts(params?: {
  page?: number
  limit?: number
  category?: string
  tag?: string
  featured?: boolean
  search?: string
}): Promise<ApiResponse<Post[]>> {
  const queryParams = new URLSearchParams()
  
  if (params?.page) queryParams.set('page', params.page.toString())
  if (params?.limit) queryParams.set('limit', params.limit.toString())
  if (params?.category) queryParams.set('category', params.category)
  if (params?.tag) queryParams.set('tag', params.tag)
  if (params?.featured) queryParams.set('featured', 'true')
  if (params?.search) queryParams.set('search', params.search)
  
  const response = await fetch(`${API_BASE_URL}/api/posts?${queryParams}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return response.json()
}

export async function getPost(slug: string): Promise<ApiResponse<Post>> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${slug}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found')
    }
    throw new Error('Failed to fetch post')
  }
  
  return response.json()
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const response = await fetch(`${API_BASE_URL}/api/categories`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  return response.json()
}

export async function getTags(): Promise<ApiResponse<Tag[]>> {
  const response = await fetch(`${API_BASE_URL}/api/tags`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch tags')
  }
  
  return response.json()
}

export async function getComments(postId: number): Promise<ApiResponse<Comment[]>> {
  const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  
  return response.json()
}

export async function createComment(postId: number, content: string, parentId?: number): Promise<ApiResponse<Comment>> {
  const response = await fetch(`${API_BASE_URL}/api/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, content, parentId }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create comment')
  }
  
  return response.json()
}

export async function searchPosts(query: string): Promise<ApiResponse<Post[]>> {
  const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
  
  if (!response.ok) {
    throw new Error('Failed to search posts')
  }
  
  return response.json()
}
