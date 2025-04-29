import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { DAY_DMY } from "~/common/format";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import { IProductResponse } from "../interfaces/productResponse.interface";
import { IProductForm } from "../interfaces";

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
  } = form;

  const { t } = useTranslation("VariantTypePage");
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
        {!data && (
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
        )}
      </div>

      {/* second column */}
      <div className="flex flex-col gap-4">
        {/* Name */}
        {data && (
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
        )}
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
