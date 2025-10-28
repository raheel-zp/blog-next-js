export interface Comment {
  id: number;
  slug: string;
  name: string;
  text: string;
  date: string;
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
