import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import SelectVariant from "./SelectVariant";
import SelectVariantValue from "./SelectVariantValue";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";
import { initSelectVariantForm } from "../common/selectVariantForm";
import { selectVariantFormSchema } from "../schema/selectVariantForm.schema";

const VariantProductManage = () => {
  const { t: tError } = useTranslation("Error");

  const form = useForm<ISelectVariantProductForm>({
    defaultValues: initSelectVariantForm,
    resolver: yupResolver(selectVariantFormSchema(tError)) as any,
  });

  const onSubmit = (data: ISelectVariantProductForm) => {
    console.log(data);
  };

  return (
    <div className="py-5">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
        <SelectVariant form={form} />

        {form.watch("variants").map((variant) => (
          <SelectVariantValue
            key={variant.value}
            variantTypeId={variant.value as string}
            variantTypeName={variant.label as string}
            form={form}
          />
        ))}

        <button onClick={form.handleSubmit(onSubmit)}>Add</button>
      </div>
    </div>
  );
};

export default VariantProductManage;
