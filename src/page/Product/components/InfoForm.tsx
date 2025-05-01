import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { UploadFile } from "antd";
import clsx from "clsx";

import { DAY_DMY } from "~/common/format";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import { IProductResponse } from "../interfaces/productResponse.interface";
import { IProductForm } from "../interfaces";
import FormField from "~/components/Core/Input/FormField";
import { Gallery, UploadImage } from "~/components/Core";
import { ETypeFile } from "~/enum/file";

interface Props {
  data?: IProductResponse;
  form: UseFormReturn<IProductForm, any, undefined>;
  isEdit?: boolean;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true } = props;
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const { t } = useTranslation("ProductPage");
  const { t: tError } = useTranslation("Error");

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-2 gap-14">
      {/* first column */}
      <div className="flex flex-col gap-4">
        {/* Id */}
        {data && (
          <div className="flex flex-col">
            <InputText
              title={t("form.id")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              required={true}
              sizeText="small"
              value={data.productId}
              disabled
            />
          </div>
        )}

        {/* Name */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.name")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              required={true}
              error={!!errors.title}
              errorMessage={errors.title?.message}
              sizeText="small"
              disabled={!isEdit}
              {...field}
            />
          )}
        />

        {/* Thumbnail */}
        <Controller
          name="thumbnailFile"
          control={control}
          render={({ field: { onChange } }) => (
            <FormField
              sizeText="small"
              title={t("form.thumbnail")}
              required
              error={!!errors.thumbnailUrl}
              errorMessage={errors.thumbnailUrl?.message}
            >
              <UploadImage
                src={getValues("thumbnailUrl")}
                disabled={!isEdit}
                className={clsx(
                  "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px] rounded-md",
                )}
                onChangeImage={(file) => {
                  if (!file) {
                    setValue("thumbnailUrl", "");
                  } else {
                    setValue("thumbnailUrl", URL.createObjectURL(file));
                  }

                  onChange(file);
                }}
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
                error={!!errors.thumbnailUrl}
              />
            </FormField>
          )}
        />

        {/* Gallery */}
        <FormField
          sizeText="small"
          title={t("form.gallery")}
          required
          error={!!errors.gallery}
          errorMessage={errors.gallery?.message}
        >
          {/* <div className="grid grid-cols-3 gap-5"> */}
          {/* {watch("gallery").map((_, index) => (
              <Controller
                key={index}
                name={`gallery.${index}`}
                control={control}
                render={({ field: { onChange } }) => (
                  <UploadImage
                    src={getValues(`gallery.${index}.url`)}
                    disabled={!isEdit}
                    className={clsx(
                      "!w-[100px] min-w-[100px] !h-[100px] border-dashed rounded-md",
                    )}
                    onChangeImage={(file) => {
                      if (!file) {
                        setValue(`gallery.${index}.url`, "");
                      } else {
                        setValue(
                          `gallery.${index}.url`,
                          URL.createObjectURL(file),
                        );
                      }

                      onChange(file);
                    }}
                    rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
                    error={!!errors.gallery}
                  />
                )}
              />
            ))} */}

          <Controller
            name={"gallery"}
            control={control}
            render={({ field: { value, onChange } }) => (
              <Gallery
                data={value.map((item) => item.file) as any[]}
                disabled={!isEdit}
                className={clsx("border-dashed rounded-md")}
                onChangeFile={(files: UploadFile[]) => {
                  if (!files) {
                    setValue("gallery", []);
                  } else {
                    const lastFile: UploadFile = files[files.length - 1];
                    const index = value.length;
                    setValue(
                      `gallery.${index}.url`,
                      URL.createObjectURL(lastFile.originFileObj),
                    );
                    setValue(`gallery.${index}.file`, lastFile.originFileObj);
                  }
                }}
                onRemoveFile={(files: UploadFile) => {
                  if (!files) {
                    setValue("gallery", []);
                  } else {
                    const newGallery = value.filter(
                      (item) => item.file.uid !== files.uid,
                    );

                    onChange(newGallery);
                  }
                }}
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
                error={!!errors.gallery}
              />
            )}
          />
          {/* </div> */}
        </FormField>
      </div>

      {/* second column */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.name")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              required={true}
              error={!!errors.title}
              errorMessage={errors.title?.message}
              sizeText="small"
              disabled={!isEdit}
              {...field}
            />
          )}
        />
      </div>

      {/* third column */}
      <div className="flex flex-col gap-4">
        {/* Created at */}
        {data && (
          <InputText
            title={t("form.createdAt")}
            placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
            sizeText="small"
            value={dayjs(data.createdAt).format(DAY_DMY)}
            disabled
          />
        )}
      </div>
    </div>
  );
};

export default InfoForm;
