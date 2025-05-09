import { DefaultOptionType } from "antd/es/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import MESSAGE_ERROR from "~/common/errorMessage";
import { SelectFilter } from "~/components/Core";
import { EOrderType } from "~/enum/paramater";
import { useScrollVariantTypeValues } from "~/page/VariantTypeValue/hooks";
import { ISelectVariantProductForm } from "../../VariantProduct/interfaces/selectVariantForm.interface";

interface Props {
  variantTypeId: string;
  variantTypeName: string;
  form: UseFormReturn<ISelectVariantProductForm, any, undefined>;
  // value: DefaultOptionType[];
  // onChange: (variantTypeId: string, value: DefaultOptionType[]) => void;
}

const SelectVariantValue = (props: Props) => {
  const { variantTypeId, variantTypeName, form } = props;

  const {
    control,
    formState: { errors },
  } = form;

  const { t: tError } = useTranslation("Error");

  const {
    variantTypeValues,
    paramaterVariantTypeValues,
    onPaginationVariantTypeValues,
  } = useScrollVariantTypeValues(
    variantTypeId
      ? {
          page: 1,
          take: 50,
          order: EOrderType.DESC,
          variantTypeId,
        }
      : null,
  );

  return (
    <Controller
      name={`variantValues.${variantTypeId}`}
      control={control}
      render={({ field: { value, onChange, ...rest } }) => (
        <SelectFilter
          title={variantTypeName}
          placeholder={`${tError(MESSAGE_ERROR.PLEASE_SELECT)} ${variantTypeName}`}
          className="w-full"
          options={variantTypeValues.map((item) => ({
            label: item.variantTypeValueName,
            value: item.variantTypeValueId,
          }))}
          sizeText="small"
          required
          value={value || null}
          mode="multiple"
          error={
            (!value || !value.length) && !!errors.variantValues?.root?.message
          }
          errorMessage={errors.variantValues?.root?.message}
          onChange={(_, option: DefaultOptionType[]) => onChange(option)}
          scrollVitual
          onScrollVitual={() =>
            onPaginationVariantTypeValues(paramaterVariantTypeValues.page + 1)
          }
          {...rest}
        />
      )}
    />
  );
};

export default SelectVariantValue;
