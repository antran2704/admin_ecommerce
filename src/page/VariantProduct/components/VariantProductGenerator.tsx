import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { Button, Spin } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useEffect, useState } from "react";

import SelectVariant from "./SelectVariant";
import SelectVariantValue from "./SelectVariantValue";
import { initSelectVariantForm } from "../common/selectVariantForm";
import { selectVariantFormSchema } from "../schemas/selectVariantForm.schema";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";
import { useProductContext } from "../../Product/hooks";
import { ICreateVariantProductRequest } from "../interfaces/createVariantProductRequest.interface";
import { apiVariantProductService } from "~/api-client/variantProduct";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { ModalConfirm } from "~/components/Modal";
import useLoading from "~/hooks/useLoading";
import useModal from "~/hooks/useModal";

interface Props {
  onRefresh: () => void;
}

const VariantProductGenerator = (props: Props) => {
  const { onRefresh } = props;

  const { t } = useTranslation("VariantProductPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { messageAntd } = useMessageAntd();

  const { product } = useProductContext();

  const form = useForm<ISelectVariantProductForm>({
    defaultValues: initSelectVariantForm,
    resolver: yupResolver(selectVariantFormSchema(tError)) as any,
  });

  const { loading, onLoading } = useLoading({ generate: false });
  const { modal, onModal } = useModal({ generate: false });

  const [removeVariantValues, setRemoveVariantValues] = useState<string[]>([]);

  const isClearAll = () => {
    const dirtyFields = form.formState.dirtyFields;
    return dirtyFields?.variants && product.options.length > 0;
  };

  const isRemoveFollowVariantValues = () => {
    const dirtyFields = form.formState.dirtyFields;

    return !dirtyFields?.variants && removeVariantValues.length > 0;
  };

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
    onModal({ generate: false });

    const variantProducts: ICreateVariantProductRequest[] =
      handleGenerateVariants(data);

    onLoading({ generate: true });

    try {
      // Delete all variant products if variant types are changed
      if (isClearAll()) {
        await apiVariantProductService.deleteAll(product.productId);
      }

      // Remove variant values if they are not selected
      if (isRemoveFollowVariantValues()) {
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
      form.reset({
        variants: data.variants,
        variantValues: data.variantValues,
      });
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    onLoading({ generate: false });
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
        disabled={!form.formState.isDirty}
        onClick={() => onModal({ generate: true })}
      >
        Generate
      </Button>

      {loading.generate && <Spin fullscreen spinning size="large" />}

      {/* Modal Delete Project */}
      <ModalConfirm
        title={t("modalGenerate.title")}
        subtitle={t("modalGenerate.subtitle")}
        open={modal.generate}
        type="info"
        okButtonProps={{
          loading: loading.generate,
          disabled: loading.generate,
        }}
        onCancel={() => onModal({ generate: false })}
        onOk={form.handleSubmit(onSubmit)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      >
        {isClearAll() && (
          <p className="text-base font-medium text-red-500">
            {t("modalGenerate.clearAll")}
          </p>
        )}
      </ModalConfirm>
    </div>
  );
};

export default VariantProductGenerator;
