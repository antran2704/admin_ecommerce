import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import { FormFooter } from "~/components/Footer";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { initProductForm } from "../common/productForm";
import { productFormSchema } from "../schema/productForm.schema";
import { ICreateProductRequest, IProductForm } from "../interfaces";
import { apiProductService } from "~/api-client/product";

const CreatePage = () => {
  const { t } = useTranslation("ProductPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const form = useForm<IProductForm>({
    defaultValues: initProductForm,
    resolver: yupResolver(productFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onSubmit = async (values: IProductForm) => {
    const dataSend: ICreateProductRequest = {
      productName: values.title,
      description: values.description,
      basePrice: values.basePrice,
      promotionPrice: values.promotionPrice,
      stock: values.stock,
      mainCategory: values.mainCategory,
      subCategories: values.subCategories,
      isActive: values.isActive,
      thumbnail: "",
      gallery: [],
    };

    try {
      if (values.thumbnailFile) {
        const newImage: string = await apiProductService.uploadImage(
          values.thumbnailFile,
        );
        dataSend.thumbnail = newImage;

        form.setValue("thumbnailFile", null);
      }

      if (values.gallery.length > 0) {
        for (let i = 0; i < values.gallery.length; i++) {
          const newImage: string = await apiProductService.uploadImage(
            values.gallery[i].file,
          );
          dataSend.gallery.push(newImage);
        }
      }

      await apiProductService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate(PATH_NAME.PRODUCTS);
    } catch (err) {
      // const { message } = hanldeErrorAxios(err);
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  return (
    <MainLayout
      titleText={t("createTitle")}
      className="bg-white"
      backUrl={PATH_NAME.PRODUCTS}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.PRODUCTS },
        { title: t("breadcrumb.create") },
      ]}
    >
      {/* Form */}
      <div className="w-full p-5">
        <InforForm form={form} />
      </div>

      <FormFooter
        okText={tCommon("add")}
        cancelText={tCommon("cancel")}
        onOk={form.handleSubmit(onSubmit, () => {
          messageAntd.error(tError(MESSAGE_ERROR.PLEASE_FILL_REQUIRED_FIELDS));
        })}
        onCancel={() => navigate(PATH_NAME.PRODUCTS)}
        cancelProps={{
          disabled: form.formState.isSubmitting,
        }}
        okProps={{
          loading: form.formState.isSubmitting,
          disabled: form.formState.isSubmitting,
        }}
      />
    </MainLayout>
  );
};

export default CreatePage;
