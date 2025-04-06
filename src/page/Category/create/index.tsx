import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import { FormFooter } from "~/components/Footer";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { ICategoryForm, ICreateCategoryRequest } from "../interfaces";
import { initCategoryForm } from "../common/categoryForm";
import { categoryFormSchema } from "../schema/categoryForm.schema";
import { apiCategoryService } from "~/api-client/category";
import { stringToSlug } from "~/helper/url";

const CreatePage = () => {
  const { t } = useTranslation("CategoryPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const form = useForm<ICategoryForm>({
    defaultValues: initCategoryForm,
    resolver: yupResolver(categoryFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onSubmit = async (values: ICategoryForm) => {
    const dataSend: ICreateCategoryRequest = {
      categoryName: values.title,
      categoryParentId: values.parentId,
      categorySlug: stringToSlug(values.slug),
      categoryThumbnail: values.thumbnailUrl,
    };

    try {
      if (values.thumbnailFile) {
        const newImage: string = await apiCategoryService.uploadThumbnail(
          values.thumbnailFile,
        );
        dataSend.categoryThumbnail = newImage;

        form.setValue("thumbnailFile", null);
      }

      await apiCategoryService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate(PATH_NAME.CATEGORIES);
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "CATEGORY_NAME_EXISTED") {
        messageAntd.error(t("error.CATEGORY_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }
  };

  return (
    <MainLayout
      titleText={t("createTitle")}
      className="bg-white"
      backUrl={PATH_NAME.CATEGORIES}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.CATEGORIES },
        { title: t("breadcrumb.create") },
      ]}>
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
        onCancel={() => navigate("/staffs")}
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
