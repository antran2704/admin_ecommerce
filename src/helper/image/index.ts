import { message } from "antd";
import { messageFile } from "~/common/file";
import { ETypeFile } from "~/enum/file";
import { FileType, ImagePayload } from "~/interface";

const convertBufferToBase64 = (image: ImagePayload): string => {
  const base64Image = Buffer.from(image.buffer, "base64");
  const dataUrl = `data:${image.mimetype};base64,${base64Image.toString(
    "base64",
  )}`;

  return dataUrl;
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const checkFile = (
  file: FileType,
  rules: ETypeFile[],
  fileSize: number = 2,
) => {
  const isValidFile: boolean = !!rules.length
    ? rules.includes(file.type as ETypeFile)
    : true;

  if (!isValidFile) {
    message.error(
      `You can only upload ${rules.reduce(
        (previous: string, rule: ETypeFile) => {
          const isLast = rules[rules.length - 1] === rule;
          const typeFile = messageFile[rule];
          return !isLast
            ? `${previous} ${typeFile} /`
            : `${previous} ${typeFile}`;
        },
        "",
      )} file!`,
    );
    return false;
  }

  const isValidFileSize = file.size / 1024 / 1024 < fileSize;
  if (!isValidFileSize) {
    message.error(`File must smaller than ${fileSize}MB!`);
  }
  return isValidFile && isValidFileSize;
};

// const checkFile = (file: FileType, rules: ETypeFile[]) => {
//   const isValid = rules.includes(file.type as ETypeFile);
//   return isValid;
// };

export { convertBufferToBase64, getBase64, checkFile };
