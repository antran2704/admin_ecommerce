import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RcFile } from "antd/es/upload";

import { InforForm } from ".";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { initProductForm } from "../common/productForm";
import { productFormSchema } from "../schemas/productForm.schema";
import { IProductForm, IUpdateProductRequest } from "../interfaces";
import { IProductResponse } from "../interfaces/productResponse.interface";
import { apiProductService } from "~/api-client/product";
import { convertToUploadFile } from "~/helper/file";
import { useProductContext } from "../hooks";
import useLoading from "~/hooks/useLoading";
import useModal from "~/hooks/useModal";

interface Props {
  isEdit: boolean;
  onEdit: () => void;
}

const EditForm = (props: Props) => {
  const { isEdit, onEdit } = props;

  const { t } = useTranslation("ProductPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const { product, setProduct } = useProductContext();

  const form = useForm<IProductForm>({
    defaultValues: initProductForm,
    resolver: yupResolver(productFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const { loading, onLoading } = useLoading({
    getData: true,
    submit: false,
  });

  const { modal, onModal } = useModal({ submit: false });

  const handleFillForm = (payload: IProductResponse) => {
    const newDataForm: IProductForm = {
      title: payload.productName,
      description: payload.description,
      basePrice: payload.basePrice,
      promotionPrice: payload.promotionPrice,
      stock: payload.stock,
      mainCategory: payload.mainCategoryId,
      subCategories: payload.subCategories.map((item) => item.categoryId),
      isActive: payload.isActive,
      thumbnailFile: null,
      thumbnailUrl: payload.thumbnail,
      gallery: payload.gallery.map((item) => ({
        file: convertToUploadFile(item, {
          type: "old",
          thumbUrl: item,
        }) as RcFile,
        url: item,
      })),
    };

    form.reset(newDataForm);

    onLoading({ getData: false });
  };

  const onSubmit = async (values: IProductForm) => {
    const dataSend: IUpdateProductRequest = {
      productName: values.title,
      description: values.description,
      basePrice: values.basePrice,
      promotionPrice: values.promotionPrice,
      stock: values.stock,
      mainCategory: values.mainCategory,
      subCategories: values.subCategories,
    };

    onLoading({ submit: true });

    try {
      if (values.thumbnailFile) {
        const newImage: string = await apiProductService.uploadImage(
          values.thumbnailFile,
        );
        dataSend.thumbnail = newImage;
      }

      if (values.gallery.length > 0) {
        dataSend.gallery = [];

        for (let i = 0; i < values.gallery.length; i++) {
          const file = values.gallery[i].file as RcFile;

          if (file.type === "old") {
            dataSend.gallery.push(values.gallery[i].url);
            continue;
          }

          const newImage: string = await apiProductService.uploadImage(
            values.gallery[i].file,
          );
          form.setValue(`gallery.${i}.url`, newImage);
          dataSend.gallery.push(newImage);
        }
      }

      await apiProductService.update(product.productId, dataSend);

      const newData: IProductResponse = {
        ...product,
      };

      if (!values.isActive && product.isActive) {
        await apiProductService.disable(product.productId);
        newData.isActive = false;
      }

      if (values.isActive && !product.isActive) {
        await apiProductService.enable(product.productId);
        newData.isActive = true;
      }

      form.setValue("thumbnailFile", null);
      form.setValue(
        "gallery",
        values.gallery.map((item) => ({
          file: convertToUploadFile(item.url, {
            type: "old",
            thumbUrl: item.url,
          }) as RcFile,
          url: item.url,
        })),
      );
      setProduct(newData);
      onModal({ submit: false });
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      switch (message) {
        case "PRODUCT_WAS_DISABLED":
          messageAntd.error(t("error.PRODUCT_WAS_DISABLED"));
          break;

        case "PRODUCT_WAS_ENABLED":
          messageAntd.error(t("error.PRODUCT_WAS_ENABLED"));
          break;

        default:
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading({ submit: false });
  };

  useEffect(() => {
    if (!product || !loading.getData) return;

    handleFillForm(product);
  }, [product, loading]);

  return (
    <Fragment>
      <div className="py-5">
        {!loading.getData && (
          <InforForm isEdit={isEdit} form={form} data={product} />
        )}
      </div>
      {isEdit && (
        <FormFooter
          okText={tCommon("save")}
          cancelText={tCommon("cancel")}
          onOk={form.handleSubmit(
            () => onModal({ submit: true }),
            () => {
              messageAntd.error(
                tError(MESSAGE_ERROR.PLEASE_FILL_REQUIRED_FIELDS),
              );
            },
          )}
          onCancel={onEdit}
          okProps={{
            loading: loading.submit,
            disabled: loading.submit,
          }}
        />
      )}

      {!isEdit && (
        <FormFooter
          okText={tCommon("update")}
          cancelText={tCommon("cancel")}
          onOk={onEdit}
          onCancel={() => navigate(PATH_NAME.PRODUCTS)}
        />
      )}

      {/* Modal Disable Collection */}
      <ModalConfirm
        title={t("modalUpdate.title")}
        subtitle={t("modalUpdate.subtitle")}
        open={modal.submit}
        onCancel={() => {
          if (loading.submit) return;
          onModal({ submit: false });
        }}
        onOk={form.handleSubmit(onSubmit)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
        cancelButtonProps={{
          disabled: loading.submit,
        }}
        okButtonProps={{
          loading: loading.submit,
          disabled: loading.submit,
        }}
      />
    </Fragment>
  );
};

export default EditForm;
