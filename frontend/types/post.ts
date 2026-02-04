export interface Post {
  id: number;
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  author?: {  // オプショナルにする
    id: number;
    username: string;
    email?: string;
  };
  created_at: string;
  updated_at: string;
}
