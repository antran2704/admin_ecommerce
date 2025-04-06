export interface ICategoryForm {
  title: string;
  slug: string;
  parentId: string;
  thumbnailUrl: string;
  thumbnailFile: File | null;
}
