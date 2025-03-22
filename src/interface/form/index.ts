interface IFormField {
  title?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string | null;
  sizeText?: "large" | "medium" | "small";
  direction?: "vertical" | "horizontal";
  gap?: number;
  classNameWrap?: string;
  children?: React.ReactNode;
}

export type { IFormField };
