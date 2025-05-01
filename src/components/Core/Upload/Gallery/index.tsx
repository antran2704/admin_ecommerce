import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import clsx from "clsx";
import { UploadChangeParam } from "antd/es/upload";
import { FileType } from "~/interface";
import { checkFile } from "~/helper/image";
import { ETypeFile } from "~/enum/file";

import "./Gallery.scss";

interface Props {
  data: UploadFile[];
  maxFile?: number;
  disabled?: boolean;
  error?: boolean;
  rules?: ETypeFile[];
  fileSize?: number;
  className?: string;
  onChangeFile?: (file: UploadFile[] | null) => void;
  onRemoveFile?: (file: UploadFile | null) => void;
}

const UploadGallery = ({
  onChangeFile,
  data,
  maxFile,
  fileSize = 2, //MB
  disabled = false,
  error,
  className,
  rules = [],
  onRemoveFile,
}: Props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList: UploadFile[] = fileList.filter(
      (item: UploadFile) => item.uid !== file.uid,
    );
    setFileList(newFileList);

    if (onRemoveFile) {
      onRemoveFile(file);
    }
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (!info.file || info.file.status === "removed") return;

    if (maxFile && fileList.length >= maxFile) return;

    const isValid: boolean = checkFile(info.file as FileType, rules, fileSize);

    if (!isValid) return;

    // update link for new file
    const newFileList = [...fileList];
    const newFile: UploadFile = info.fileList[info.fileList.length - 1];

    newFileList.push({
      ...newFile,
      url: URL.createObjectURL(info.file as any),
    });

    setFileList(newFileList);

    if (onChangeFile) {
      onChangeFile(newFileList);
    }
  };

  useEffect(() => {
    setFileList(data);
  }, []);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <div className="w-full h-full">
      <Upload
        listType="picture-card"
        rootClassName={clsx(
          "gallery relative flex items-center justify-center w-full h-full",
          [
            maxFile && fileList.length >= maxFile && "disabled",
            [error && "border-red-400 hover:border-red-400"],
            className,
          ],
        )}
        fileList={fileList}
        beforeUpload={() => false}
        onPreview={handlePreview}
        disabled={disabled}
        onRemove={handleRemove}
        onChange={handleChange}
      >
        {maxFile && fileList.length >= maxFile ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default UploadGallery;
