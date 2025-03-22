import { ETypeFile } from "~/enum/file";

const messageFile: { [k: string]: string } = {
  [ETypeFile.PDF]: "PDF",
  [ETypeFile.EXCEL]: "EXCEL",
  [ETypeFile.PNG]: "PNG",
  [ETypeFile.JPEG]: "JPEG",
  [ETypeFile.WEBP]: "WEBP",
  [ETypeFile.WORD]: "WORD",
};

export { messageFile };
