import { LegacyRef, MouseEvent, forwardRef, useEffect, useState } from "react";
import { Image, Upload, UploadProps } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { LoadingOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { AiOutlineExpand } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

import CameraImage from "@assets/icons/camera.png";

import { FileType, IUploadComponent } from "~/interface";

import { NO_IMAGE } from "~/common/image";
import { checkFile, getBase64 } from "~/helper/image";

import { ModalConfirm } from "../../../Modal";

import "./Image.scss";
import { useTranslation } from "react-i18next";
import FormField from "../../Input/FormField";
import { UploadRef } from "antd/es/upload/Upload";

const UploadImageCompoent = (
  props: IUploadComponent,
  ref: LegacyRef<UploadRef<any>>,
) => {
  const {
    src = "",
    rules = [],
    fileSize = 2, //MB
    error = false,
    disabled = false,
    title,
    showIcons,
    className,
    classNames,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    noteElement,
    loading,
    icons,
    onChangeImage,
  } = props;

  const { t: tCommon } = useTranslation("Common");

  const [previewImage, setPreviewImage] = useState<string>("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const optionShowIcons =
    showIcons !== null
      ? {
          preview: true,
          remove: true,
          ...showIcons,
        }
      : null;

  const onShowModal = () => {
    setShowModal(!showModal);
  };

  const onRemoveImage = async () => {
    setPreviewImage("");
    if (onChangeImage) onChangeImage(null);
    onShowModal();
  };

  const handlePreview = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreviewOpen(true);
  };

  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onShowModal();
  };

  const handleChangeImage: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    getBase64(info.file as FileType, (url) => {
      setPreviewImage(url);
    });

    if (onChangeImage) onChangeImage(info.file as FileType);
  };

  useEffect(() => {
    setPreviewImage(src);
  }, [src]);

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
      <div className={clsx("flex items-center gap-5", [classNames?.note])}>
        <Upload
          name="avatar"
          ref={ref}
          listType="picture-card"
          rootClassName={clsx(
            "group relative w-full h-full border-2 rounded-lg",
            [
              !previewImage
                ? "border-dashed hover:border-green-200"
                : "border-none",
            ],
            [!previewImage ? "bg-green-50" : "bg-transparent"],
            [classNames?.root],

            // Style when Loading
            [loading && "border-none pointer-events-none opacity-80"],

            // Style when error
            [error && "border-red-400 hover:border-red-400"],
            {
              uploaded: !!previewImage,
            },
          )}
          disabled={disabled}
          className={clsx("avatar-uploader", className)}
          showUploadList={false}
          beforeUpload={() => false}
          onChange={(info: UploadChangeParam<UploadFile>) => {
            checkFile(info.file as FileType, rules, fileSize) &&
              handleChangeImage(info);
          }}
        >
          {/* Show if image uploaded */}
          {previewImage && (
            <div className="w-full h-full rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="avatar"
                className={clsx(
                  "lazyloaded w-full h-full object-cover object-center",
                )}
              />

              {previewImage !== NO_IMAGE && optionShowIcons && (
                <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
                  {optionShowIcons.preview && (
                    <button
                      onClick={handlePreview}
                      className="flex items-center justify-center w-8 h-8 bg-black/40 text-white opacity-80 hover:opacity-100 rounded-full transition-all ease-linear duration-100"
                    >
                      <AiOutlineExpand className="w-5 h-5 min-w-5" />
                    </button>
                  )}
                  {!disabled && optionShowIcons.remove && (
                    <button
                      onClick={handleRemoveImage}
                      className="flex items-center justify-center w-8 h-8 bg-black/40 text-white opacity-80 hover:opacity-100 rounded-full transition-all ease-linear duration-100"
                    >
                      <RiDeleteBin6Line className="w-5 h-5 min-w-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Show if don't upload image */}
          {!previewImage && !icons?.placeholder && (
            <img
              src={CameraImage}
              className={clsx("lazyloaded w-9 h-8", [classNames?.icon])}
            />
          )}

          {/* Show if don't upload image with custom icon */}
          {!previewImage && !!icons?.placeholder && icons?.placeholder}

          {/* Show if loading */}
          {loading && (
            <div className="absolute w-full h-full top-0 flex items-center justify-center bg-gray-500/40 rounded-lg border z-10">
              <LoadingOutlined className="text-green-500 text-3xl" />
            </div>
          )}
        </Upload>

        {noteElement}
      </div>

      {/* Popup review image */}
      {previewOpen && previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
          }}
          src={previewImage}
        />
      )}

      {/* Modal Disable Collection */}
      <ModalConfirm
        title="Xóa ảnh"
        subtitle="Bạn muốn xóa ảnh này không?"
        open={showModal}
        type="danger"
        onCancel={onShowModal}
        onOk={onRemoveImage}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          size: "large",
          className: clsx("md:w-[100px] w-1/2 !bg-[#F0A328]"),
        }}
        cancelButtonProps={{
          className: "md:w-[100px] w-1/2",
          size: "large",
        }}
        destroyOnClose={true}
      />
    </FormField>
  );
};

export default forwardRef(UploadImageCompoent);
