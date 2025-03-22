import { GetProp, UploadProps } from "antd";
import { IFormField } from "../form";
import { ETypeFile } from "~/enum/file";

interface IFile {
  fileName: string;
  originalName?: string;
  url?: string;
}

interface ImagePayload {
  buffer: string;
  encoding: string;
  fieldname: string;
  mimetype: string;
  originalname: string;
  size: number;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IUploadComponent extends IFormField {
  src?: string;
  error?: boolean;
  className?: string;
  classNames?: {
    icon?: string;
    note?: string;
    root?: string;
  };
  showIcons?: {
    preview?: boolean;
    remove?: boolean;
  };
  icons?: {
    preview?: JSX.Element;
    remove?: JSX.Element;
    placeholder?: JSX.Element;
  };
  fileSize?: number;
  disabled?: boolean;
  rules: ETypeFile[];
  noteElement?: JSX.Element;
  loading?: boolean;
  onChangeImage?: (file: File | null) => void;
}

export type { ImagePayload, FileType, IFile, IUploadComponent };
