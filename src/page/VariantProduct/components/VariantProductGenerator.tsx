import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useEffect, useState } from "react";

import SelectVariant from "./SelectVariant";
import SelectVariantValue from "./SelectVariantValue";
import { initSelectVariantForm } from "../common/selectVariantForm";
import { selectVariantFormSchema } from "../../Product/schema/selectVariantForm.schema";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";
import { useProductContext } from "../../Product/hooks";
import { ICreateVariantProductRequest } from "../interfaces/createVariantProductRequest.interface";
import { apiVariantProductService } from "~/api-client/variantProduct";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import MESSAGE_SUCCESS from "~/common/successMessage";

interface Props {
  onRefresh: () => void;
}

const VariantProductGenerator = (props: Props) => {
  const { onRefresh } = props;

  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { messageAntd } = useMessageAntd();

  const { product } = useProductContext();

  const form = useForm<ISelectVariantProductForm>({
    defaultValues: initSelectVariantForm,
    resolver: yupResolver(selectVariantFormSchema(tError)) as any,
  });

  const [removeVariantValues, setRemoveVariantValues] = useState<string[]>([]);

  const handleRecursion = (
    items: DefaultOptionType[][],
    currentValue: DefaultOptionType[],
    callback: (result: DefaultOptionType[]) => void,
  ) => {
    if (items.length === 0) {
      callback(currentValue);
      return;
    }

    for (let j = 0; j < items[0].length; j++) {
      const item = items[0][j];
      const newValue = [...currentValue, item];
      handleRecursion(items.slice(1), newValue, callback);
    }
  };

  const handleGenerateVariants = (
    data: ISelectVariantProductForm,
  ): ICreateVariantProductRequest[] => {
    const variantValues = data.variantValues;

    const variantProducts: ICreateVariantProductRequest[] = [];
    const variantValue = Object.values(variantValues)[0];

    for (let j = 0; j < variantValue.length; j++) {
      handleRecursion(
        Object.values(variantValues).slice(1),
        [variantValue[j]],
        (result: DefaultOptionType[]) => {
          const productName =
            product.productName +
            " " +
            result.map((item) => item.label).join("/");

          const variantValueIds = result.map((item) => item.value) as string[];

          const newVaraintProduct: ICreateVariantProductRequest = {
            productId: product.productId,
            variantProductName: productName,
            basePrice: 0,
            promotionPrice: 0,
            isActive: true,
            stock: 0,
            thumbnail: "",
            variantValueIds: variantValueIds,
          };

          variantProducts.push(newVaraintProduct);
        },
      );
    }

    return variantProducts;
  };

  const onSubmit = async (data: ISelectVariantProductForm) => {
    const variantProducts: ICreateVariantProductRequest[] =
      handleGenerateVariants(data);

    const dirtyFields = form.formState.dirtyFields;

    try {
      // Delete all variant products if variant types are changed
      if (dirtyFields?.variants && product.options.length > 0) {
        await apiVariantProductService.deleteAll(product.productId);
      }

      // Remove variant values if they are not selected
      if (!dirtyFields?.variants && removeVariantValues.length > 0) {
        await apiVariantProductService.removeFollowVariantValues(
          product.productId,
          { variantValueIds: removeVariantValues },
        );

        setRemoveVariantValues([]);
      }

      for (const variantProduct of variantProducts) {
        await apiVariantProductService.create(variantProduct);
      }

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));

      onRefresh();
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  useEffect(() => {
    if (!product) return;

    const variants = product.options.map((option) => ({
      label: option.name,
      value: option.id,
    }));

    const variantValues = product.options.reduce(
      (acc, option) => {
        acc[option.id] = option.values.map((value) => ({
          label: value.name,
          value: value.id,
        }));
        return acc;
      },
      {} as Record<string, DefaultOptionType[]>,
    );

    form.reset({ variants, variantValues });
  }, [product]);

  return (
    <div className="flex items-center flex-wrap gap-5">
      <div className="flex-1 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
        <SelectVariant form={form} />

        {form.watch("variants").map((variant) => (
          <SelectVariantValue
            key={variant.value}
            variantTypeId={variant.value as string}
            variantTypeName={variant.label as string}
            form={form}
            removeVariantValues={removeVariantValues}
            setRemoveVariantValues={setRemoveVariantValues}
          />
        ))}
      </div>
      <Button
        size="large"
        type="primary"
        disabled={!form.watch("variants").length}
        onClick={form.handleSubmit(onSubmit)}
      >
        Generate
      </Button>
    </div>
  );
};

export default VariantProductGenerator;
