
export interface CommentAuthor {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  authorId: number;
  author: CommentAuthor;
}

export interface CommentFormData {
  postSlug: string;
  name: string;
  message: string;
}

export const formatDate = (isoDate: string): string => {
  return new Date(isoDate).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
