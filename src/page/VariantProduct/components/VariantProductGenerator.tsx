import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { DefaultOptionType } from "antd/es/select";

import SelectVariant from "../../Product/components/SelectVariant";
import SelectVariantValue from "../../Product/components/SelectVariantValue";
import { initSelectVariantForm } from "../common/selectVariantForm";
import { selectVariantFormSchema } from "../../Product/schema/selectVariantForm.schema";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";
import { useProductContext } from "../../Product/hooks";
import { ICreateVariantProductRequest } from "../interfaces/createVariantProductRequest.interface";

const VariantProductGenerator = () => {
  const { t: tError } = useTranslation("Error");

  const { product } = useProductContext();

  const form = useForm<ISelectVariantProductForm>({
    defaultValues: initSelectVariantForm,
    resolver: yupResolver(selectVariantFormSchema(tError)) as any,
  });

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

  const handleGenerateVariants = () => {
    const variantValues = form.getValues("variantValues");

    const result = [];
    const variantValue = Object.values(variantValues)[0];
    for (let j = 0; j < variantValue.length; j++) {
      result.push(
        handleRecursion(
          Object.values(variantValues).slice(1),
          [variantValue[j]],
          (result: DefaultOptionType[]) => {
            console.log(
              "result:::",
              product.productName +
                " " +
                result.map((item) => item.label).join("/"),
            );
          },
        ),
      );
    }

    // console.log("result", result);
  };

  const onSubmit = (data: ISelectVariantProductForm) => {
    handleGenerateVariants();
  };

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
