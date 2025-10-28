export interface Post {
  id: number;
  slug: string;
  title: string;
  image: string;
  description?: string;
  excerpt?: string;
  content: string;
  date: string;
}