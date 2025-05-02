import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
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
import { productFormSchema } from "../schema/productForm.schema";
import { IProductForm, IUpdateProductRequest } from "../interfaces";
import { IProductResponse } from "../interfaces/productResponse.interface";
import { apiProductService } from "~/api-client/product";
import { convertToUploadFile } from "~/helper/file";

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

  const { product_id } = useParams();
  const navigate = useNavigate();

  const form = useForm<IProductForm>({
    defaultValues: initProductForm,
    resolver: yupResolver(productFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [data, setData] = useState<IProductResponse | null>(null);

  const [loading, setLoading] = useState<{ getData: boolean; submit: boolean }>(
    { getData: false, submit: false },
  );

  const [modal, setModal] = useState<{
    changePassword: boolean;
    submit: boolean;
  }>({ changePassword: false, submit: false });

  const onModal = (type: keyof typeof modal, value: boolean) => {
    setModal({
      ...modal,
      [type]: value,
    });
  };

  const onLoading = (type: keyof typeof loading, value: boolean) => {
    setLoading({
      ...loading,
      [type]: value,
    });
  };

  const handleGetData = async (id: string) => {
    onLoading("getData", true);

    await apiProductService
      .product(id)
      .then((payload: IProductResponse) => {
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
        setData(payload);
        onLoading("getData", false);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          messageAntd.error(t("error.PRODUCT_NOT_FOUND"));
          navigate(PATH_NAME.PRODUCTS);
        }
      });
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

    onLoading("submit", true);

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

      await apiProductService.update(data.productId, dataSend);

      const newData: IProductResponse = {
        ...data,
      };

      if (!values.isActive && data.isActive) {
        await apiProductService.disable(data.productId);
        newData.isActive = false;
      }

      if (values.isActive && !data.isActive) {
        await apiProductService.enable(data.productId);
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
      setData(newData);
      onModal("submit", false);
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

    onLoading("submit", false);
  };

  useEffect(() => {
    if (!product_id) return;

    handleGetData(product_id);
  }, [product_id]);

  return (
    <Fragment>
      <div className="py-5">
        {data && <InforForm isEdit={isEdit} form={form} data={data} />}
      </div>
      {isEdit && (
        <FormFooter
          okText={tCommon("save")}
          cancelText={tCommon("cancel")}
          onOk={form.handleSubmit(
            () => onModal("submit", true),
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
          onModal("submit", false);
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
