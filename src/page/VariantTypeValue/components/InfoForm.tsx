import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { DAY_DMY } from "~/common/format";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import {
  IVariantTypeValueForm,
  IVariantTypeValueResponse,
} from "../interfaces";

interface Props {
  data?: IVariantTypeValueResponse;
  form: UseFormReturn<IVariantTypeValueForm, any, undefined>;
  isEdit?: boolean;
  onSubmit: (values: IVariantTypeValueForm) => void;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true, onSubmit } = props;
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form;

  const { t } = useTranslation("VariantTypeValuePage");
  const { t: tError } = useTranslation("Error");

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 py-2 gap-14">
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
              value={data.variantTypeValueId}
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
              onPressEnter={handleSubmit(onSubmit)}
              {...field}
            />
          )}
        />
      </div>

      {/* second column */}
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
