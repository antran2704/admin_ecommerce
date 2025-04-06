import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { DAY_DMY } from "~/common/format";
import { InputText } from "~/components/Core/Input";
import { ICategoryForm, ICategoryResponse } from "../interfaces";
import MESSAGE_ERROR from "~/common/errorMessage";
import { UploadImage } from "~/components/Core";
import clsx from "clsx";
import { ETypeFile } from "~/enum/file";
import FormField from "~/components/Core/Input/FormField";
import { stringToSlug } from "~/helper/url";
import { useEffect } from "react";
import TreeCategories from "./TreeCategories";

interface Props {
  data?: ICategoryResponse;
  form: UseFormReturn<ICategoryForm, any, undefined>;
  isEdit?: boolean;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true } = props;
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = form;

  const { t } = useTranslation("CategoryPage");
  const { t: tError } = useTranslation("Error");

  useEffect(() => {
    const slug = watch("slug");
    if (!slug) return;

    const timmer = setTimeout(() => {
      setValue("slug", stringToSlug(slug));
    }, 500);

    return () => clearTimeout(timmer);
  }, [watch("slug")]);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-2 gap-14">
      {/* first column */}
      <div className="flex flex-col gap-4">
        {/* User id */}
        {data && (
          <div className="flex flex-col">
            <InputText
              title={t("form.id")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              required={true}
              sizeText="small"
              value={data.categoryId}
              disabled
            />
          </div>
        )}

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
              errorMessage={errors.thumbnailUrl?.message}>
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
              />
            </FormField>
          )}
        />
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

        {/* Slug */}
        <Controller
          name="slug"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.slug")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              error={!!errors.slug}
              errorMessage={errors.slug?.message}
              sizeText="small"
              disabled={!isEdit}
              {...field}
            />
          )}
        />
      </div>

      {/* third column */}
      <div className="flex flex-col gap-4">
        <TreeCategories form={form} data={data} isEdit={isEdit} />

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
