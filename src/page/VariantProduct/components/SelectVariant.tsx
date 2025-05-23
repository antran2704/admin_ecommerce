import { DefaultOptionType } from "antd/es/select";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { SelectFilter } from "~/components/Core";
import { EOrderType } from "~/enum/paramater";
import { useScrollVariantTypes } from "~/page/VariantType/hooks";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";

interface Props {
  form: UseFormReturn<ISelectVariantProductForm, any, undefined>;
}

const SelectVariant = (props: Props) => {
  const { form } = props;

  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = form;

  const { t } = useTranslation("VariantProductPage");

  const { variantTypes, paramaterVariantTypes, onPaginationVariantTypes } =
    useScrollVariantTypes({
      page: 1,
      take: 50,
      order: EOrderType.DESC,
    });

  const onChangeSelect = (options: DefaultOptionType[]) => {
    const oldVariantValues = getValues("variantValues");
    const newVariantValues = {};

    for (const option of options) {
      if (oldVariantValues[option.value]) {
        newVariantValues[option.value] = oldVariantValues[option.value];
      }
    }

    setValue("variantValues", newVariantValues);
  };

  return (
    <Controller
      name="variants"
      control={control}
      render={({ field: { value, onChange, ...rest } }) => (
        <SelectFilter
          title={t("placeholder.variant")}
          placeholder={t("placeholder.selectVariant")}
          className="w-full"
          options={variantTypes.map((item) => ({
            label: item.variantTypeName,
            value: item.variantTypeId,
          }))}
          sizeText="small"
          required
          value={value || null}
          mode="multiple"
          error={!!errors.variants}
          errorMessage={errors.variants?.message}
          onChange={(_, options: DefaultOptionType[]) => {
            onChangeSelect(options);
            onChange(options);
          }}
          scrollVitual
          onScrollVitual={() =>
            onPaginationVariantTypes(paramaterVariantTypes.page + 1)
          }
          {...rest}
        />
      )}
    />
  );
};

export default SelectVariant;
