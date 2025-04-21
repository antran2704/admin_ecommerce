export interface ICategoryResponse {
  categoryId: string;
  categoryName: string;
  categoryParentId: string;
  categoryParentName: string;
  categoryThumbnail: string;
  categorySlug: string;
  childrenCount: number;
  createdAt: string;
}
