import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import {
  ICategoryForm,
  ICategoryResponse,
  IUpdateCategoryRequest,
} from "../interfaces";
import { initCategoryForm } from "../common/categoryForm";
import { categoryFormSchema } from "../schema/categoryForm.schema";
import { apiCategoryService } from "~/api-client/category";

const EditPage = () => {
  const { t } = useTranslation("CategoryPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { user_id } = useParams();
  const { edit: editParam } = useGetSearchParams<{
    edit: string;
  }>({
    edit: "string",
  });

  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const form = useForm<ICategoryForm>({
    defaultValues: initCategoryForm,
    resolver: yupResolver(categoryFormSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [data, setData] = useState<ICategoryResponse | null>(null);

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

  const onChangeAvartar = (file: File | null) => {
    if (!file) {
      form.setValue("thumbnailUrl", "");
    }

    form.setValue("thumbnailFile", file);
  };

  const handleGetData = async (id: string) => {
    onLoading("getData", true);

    await apiCategoryService  
      .category(id)
      .then((payload: ICategoryResponse) => {
        form.reset({
          title: payload.categoryName,
          parentId: payload.categoryParentId,
          slug: payload.categorySlug,
          thumbnailUrl: payload.categoryThumbnail,
          thumbnailFile: null,
        });
        setData(payload);
        onLoading("getData", false);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          navigate(PATH_NAME.USERS);
        }
      });
  };

  const onSubmit = async (values: ICategoryForm) => {
    const dataSend: IUpdateCategoryRequest = {
      categoryName: values.title,
      categoryParentId: values.parentId,
      categorySlug: values.slug,
      categoryThumbnail: values.thumbnailUrl,
    };

    onLoading("submit", true);

    try {
      if (values.thumbnailFile) {
        const newImage: string = await apiCategoryService.uploadThumbnail(
          values.thumbnailFile,
        );
        dataSend.categoryThumbnail = newImage;

        form.setValue("thumbnailFile", null);
      }

      await apiCategoryService.update(data.categoryId, dataSend);

      onModal("submit", false);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "CATEGORY_NAME_EXISTED") {
        messageAntd.error(t("error.CATEGORY_NAME_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading("submit", false);
  };

  useEffect(() => {
    if (!user_id) return;

    handleGetData(user_id);
  }, [user_id]);

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl={PATH_NAME.USERS}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.USERS },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}>
      <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
        <div className="mx-auto">
          {data && (
            <div className="flex flex-col items-center">
              {/* <UploadImage
                src={form.watch("avatar")}
                className={clsx(
                  "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px] rounded-full",
                )}
                disabled={!isEdit}
                onChangeImage={onChangeAvartar}
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
              /> */}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="xl:w-10/12 w-full px-5">
          <InforForm isEdit={isEdit} form={form} data={data} />
        </div>
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
          onCancel={() => navigate("/staffs")}
          okProps={
            {
              // className: !canEditForm(staffId, infoUser.userId) && "hidden",
            }
          }
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
    </MainLayout>
  );
};

export default EditPage;
