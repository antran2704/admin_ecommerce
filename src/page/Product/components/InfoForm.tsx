import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Switch, type UploadFile } from "antd";
import clsx from "clsx";

import { DAY_DMY } from "~/common/format";
import { InputNumber, InputText, InputTextArea } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import { IProductResponse } from "../interfaces/productResponse.interface";
import { IProductForm } from "../interfaces";
import FormField from "~/components/Core/Input/FormField";
import { Gallery, SelectFilter, UploadImage } from "~/components/Core";
import { ETypeFile } from "~/enum/file";
import { useScrollCategories } from "~/page/Category/hooks";
import { EOrderType } from "~/enum/paramater";
import { formatBigNumber } from "~/helper/format";

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
    clearErrors,
  } = form;

  const { t } = useTranslation("ProductPage");
  const { t: tError } = useTranslation("Error");

  const { categories, paramaterCategories, onPaginationCategories } =
    useScrollCategories({
      page: 1,
      take: 50,
      order: EOrderType.DESC,
    });

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
            <InputTextArea
              title={t("form.name")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              required={true}
              error={!!errors.title}
              errorMessage={errors.title?.message}
              sizeText="small"
              maxLength={100}
              showCount
              rows={3}
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
                  clearErrors("thumbnailUrl");
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
          <Controller
            name="gallery"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Gallery
                data={value.map((item) => item.file) as any[]}
                disabled={!isEdit}
                maxFile={6}
                className={clsx("border-dashed rounded-md")}
                onChangeFile={(files: UploadFile[]) => {
                  if (!files) {
                    setValue("gallery", []);
                  } else {
                    const lastFile: UploadFile = files[files.length - 1];
                    const index = files.length - 1;

                    setValue(
                      `gallery.${index}.url`,
                      URL.createObjectURL(lastFile.originFileObj),
                    );
                    setValue(`gallery.${index}.file`, lastFile.originFileObj);
                    clearErrors("gallery");
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
        </FormField>
      </div>

      {/* second column */}
      <div className="flex flex-col gap-4">
        {/* Category */}
        <Controller
          name="mainCategory"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <SelectFilter
              title={t("form.category")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
              className="w-full"
              options={categories.map((item) => ({
                label: item.categoryName,
                value: item.categoryId,
              }))}
              error={!!errors.mainCategory}
              errorMessage={errors.mainCategory?.message}
              sizeText="small"
              required
              disabled={!isEdit}
              value={value || null}
              scrollVitual
              onScrollVitual={() =>
                onPaginationCategories(paramaterCategories.page + 1)
              }
              {...rest}
            />
          )}
        />

        {/* Subcategories */}
        <Controller
          name="subCategories"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <SelectFilter
              title={t("form.subcategories")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
              className="w-full"
              options={categories.map((item) => ({
                label: item.categoryName,
                value: item.categoryId,
              }))}
              error={!!errors.subCategories}
              errorMessage={errors.subCategories?.message}
              sizeText="small"
              disabled={!isEdit}
              value={value || null}
              mode="multiple"
              scrollVitual
              onScrollVitual={() =>
                onPaginationCategories(paramaterCategories.page + 1)
              }
              {...rest}
            />
          )}
        />

        {/* Base price */}
        <Controller
          name="basePrice"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.basePrice")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              value={!!value ? formatBigNumber(value) : 0}
              maximum={999999999}
              disabled={!isEdit}
              error={!!errors.basePrice}
              errorMessage={errors.basePrice?.message}
              onChangeValue={(value: number) => onChange(value)}
              {...rest}
            />
          )}
        />

        {/* Promotion price */}
        <Controller
          name="promotionPrice"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.promotionPrice")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              value={!!value ? formatBigNumber(value) : ""}
              maximum={999999999}
              onChangeValue={(value: number) => onChange(value)}
              disabled={!isEdit}
              error={!!errors.promotionPrice}
              errorMessage={errors.promotionPrice?.message}
              {...rest}
            />
          )}
        />

        {/* Stock */}
        <Controller
          name="stock"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <InputNumber
              title={t("form.stock")}
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              value={!!value ? formatBigNumber(value) : 0}
              maximum={999999999}
              disabled={!isEdit}
              error={!!errors.stock}
              errorMessage={errors.stock?.message}
              onChangeValue={(value: number) => onChange(value)}
              {...rest}
            />
          )}
        />
      </div>

      {/* third column */}
      <div className="flex flex-col gap-4">
        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputTextArea
              title={t("form.description")}
              required
              placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
              rows={6}
              maxLength={1000}
              showCount
              disabled={!isEdit}
              error={!!errors.description}
              errorMessage={errors.description?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormField sizeText="small" title={t("form.status")}>
              <Switch
                className="w-fit"
                checked={value}
                disabled={!isEdit}
                onChange={onChange}
              />
            </FormField>
          )}
        />

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
