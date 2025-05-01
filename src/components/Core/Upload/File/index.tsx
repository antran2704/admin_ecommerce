import { forwardRef, useEffect, useState } from "react";
import { Upload, UploadProps } from "antd";
import { FaFile } from "react-icons/fa";

import {
  UploadChangeParam,
  UploadFile as UploadFileType,
} from "antd/es/upload";

import { FileType } from "~/interface";
import { ETypeFile } from "~/enum/file";

import { checkFile } from "~/helper/image";

import UploadIcon from "@assets/icons/uploadFile.png";
import "./File.scss";

import clsx from "clsx";
import { IFormField } from "~/interface/form";
import FormField from "../../Input/FormField";
import { useTranslation } from "react-i18next";

interface Props extends IFormField {
  data: UploadFileType[];
  maxFile?: number;
  fileSize?: number;
  multiple?: boolean;
  disable?: boolean;
  rules?: ETypeFile[];
  className?: string;
  content?: JSX.Element;
  onChangeFile?: (file: UploadFileType[] | UploadFileType | null) => void;
  onRemoveFile?: (file: UploadFileType | null) => void;
  ref: any;
}

const UploadFileComponent = (
  {
    onChangeFile,
    data = [],
    maxFile,
    fileSize = 2, //MB
    multiple = false,
    disable = false,
    rules = [],
    content,
    title,
    error,
    className,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    onRemoveFile,
  }: Props,
  ref: any,
) => {
  const { t: tCommon } = useTranslation("Common");
  const [fileList, setFileList] = useState<UploadFileType[]>([]);

  const handleRemove = (file: UploadFileType) => {
    const newFileList: UploadFileType[] = fileList.filter(
      (item: UploadFileType) => item.uid !== file.uid,
    );
    setFileList(newFileList);

    if (onRemoveFile && multiple) {
      onRemoveFile(file);
    }

    if (onRemoveFile && !multiple) {
      onRemoveFile(null);
    }
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFileType>,
  ) => {
    if (!info.file || info.file.status === "removed") return;

    if (maxFile && fileList.length >= maxFile) return;

    // update link for new file
    const newFileList = [...fileList];
    const newFile: UploadFileType = info.fileList[info.fileList.length - 1];

    newFileList.push({
      ...newFile,
      url: URL.createObjectURL(info.file as any),
    });

    setFileList(newFileList);

    if (onChangeFile && multiple) {
      onChangeFile(newFileList);
    }

    if (onChangeFile && !multiple) {
      onChangeFile(newFileList[0]);
    }
  };

  useEffect(() => {
    setFileList(data);
  }, [data]);

  return (
    <FormField
      title={title}
      error={error}
      errorMessage={errorMessage}
      required={required}
      sizeText={sizeText}
      direction={direction}
      classNameWrap={classNameWrap}
    >
      <Upload
        disabled={disable}
        multiple={multiple}
        beforeUpload={() => false}
        iconRender={() => (
          <div className="flex items-center justify-center translate-y-1/2">
            <FaFile className="text-2xl text-primary-color" />
          </div>
        )}
        onRemove={(file: UploadFileType) => handleRemove(file)}
        onChange={(info: UploadChangeParam<UploadFileType>) => {
          info.file.status !== "removed" &&
            checkFile(info.file as FileType, rules, fileSize) &&
            handleChange(info);
        }}
        listType="picture"
        maxCount={maxFile}
        className={clsx(
          "group w-full h-full border border-gray-200 border-dashed rounded-lg transition-all ease-linear duration-100",
          [fileList.length && "p-2"],
          [!disable && "hover:border-primary-color "],
          [error && "border-red-500"],
          className,
        )}
        fileList={fileList}
        ref={ref}
      >
        {multiple && !content && (
          <button
            className={clsx(
              "flex flex-col items-center justify-center px-6 py-3 gap-2",
              [maxFile && fileList.length >= maxFile && "hidden"],
              [
                disable
                  ? "pointer-events-none"
                  : "group-hover:text-primary-color ",
              ],
            )}
          >
            <img src={UploadIcon} alt="upload" />
            {tCommon("file.importFile")}
          </button>
        )}

        {!content && !multiple && !fileList.length && (
          <button
            className={clsx(
              "flex flex-col items-center justify-center px-6 py-3 gap-2",
              [
                disable
                  ? "pointer-events-none"
                  : "group-hover:text-primary-color ",
              ],
            )}
          >
            <img src={UploadIcon} alt="upload" />
            {tCommon("file.importFile")}
          </button>
        )}

        {content}
      </Upload>
    </FormField>
  );
};

export default forwardRef(UploadFileComponent);
