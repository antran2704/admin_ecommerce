import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { ChangePasswordModal, InforForm } from "../components";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import useMessageAntd from "~/hooks/useMessageAntd";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import { UploadImage } from "~/components/Core";
import { ETypeFile } from "~/enum/file";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import ChangePassword from "~/components/ChangePassword";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { IUpdateUserRequest, IUserForm, IUserResponse } from "../interfaces";
import { initUserForm } from "../common/userForm";
import { updateUserSchema } from "../schema/updateUser.schema";
import { apiUserService } from "~/api-client/user";

const EditPage = () => {
  const { t } = useTranslation("UserPage");
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

  const form = useForm<IUserForm>({
    defaultValues: initUserForm,
    resolver: yupResolver(updateUserSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [data, setData] = useState<IUserResponse | null>(null);

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
      form.setValue("avatar", "");
    }

    form.setValue("avatarFile", file);
  };

  const handleGetData = async (id: string) => {
    onLoading("getData", true);

    await apiUserService
      .user(id)
      .then((payload: IUserResponse) => {
        form.reset({
          email: payload.email,
          name: payload.name,
          status: payload.isActive
            ? ENUM_ACCOUNT_STATUS.ACTIVE
            : ENUM_ACCOUNT_STATUS.INACTIVE,
          banStatus: payload.isBan
            ? ENUM_ACCOUNT_STATUS.BANNED
            : ENUM_ACCOUNT_STATUS.UNBAN,
          birthday: payload.birthday || "",
          phoneNumber: payload.phoneNumber || "",
          avatar: payload.avatar || "",
          avatarFile: null,
          password: "",
          confirmPassword: "",
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

  const onSubmit = async (values: IUserForm) => {
    const dataSend: IUpdateUserRequest = {
      name: values.name,
      avatar: values.avatar,
      birthday: values.birthday,
      phoneNumber: values.phoneNumber,
    };

    onLoading("submit", true);

    try {
      if (values.avatarFile) {
        const newImage: string = await apiUserService.uploadAvatar(
          values.avatarFile,
        );
        dataSend.avatar = newImage;

        form.setValue("avatarFile", null);
      }

      // update infomation of staff
      await apiUserService.update(data.userId, dataSend);

      // update status of staff
      if (values.status === ENUM_ACCOUNT_STATUS.ACTIVE && !data.isActive) {
        await apiUserService.enable(data.userId);
        setData({ ...data, isActive: true });
      }

      if (values.status === ENUM_ACCOUNT_STATUS.INACTIVE && data.isActive) {
        await apiUserService.disable(data.userId);
        setData({ ...data, isActive: false });
      }

      // update ban status of staff
      if (values.banStatus === ENUM_ACCOUNT_STATUS.BANNED && !data.isBan) {
        await apiUserService.ban(data.userId);
        setData({ ...data, isBan: true });
      }

      if (values.banStatus === ENUM_ACCOUNT_STATUS.UNBAN && data.isBan) {
        await apiUserService.unban(data.userId);
        setData({ ...data, isBan: false });
      }

      onModal("submit", false);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "ADMIN_IS_EXISTED") {
        messageAntd.error(tError(message));
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
      ]}
    >
      <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
        <div className="mx-auto">
          {data && (
            <div className="flex flex-col items-center">
              <UploadImage
                src={form.watch("avatar")}
                className={clsx(
                  "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px] rounded-full",
                )}
                disabled={!isEdit}
                onChangeImage={onChangeAvartar}
                rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
              />

              {isEdit &&
                ability.can(
                  EPermisisonAction.CHANGE_PASSWORD,
                  EPageRole.ADMIN_STAFF,
                ) && (
                  <ChangePassword
                    onModal={() => onModal("changePassword", true)}
                  >
                    <ChangePasswordModal
                      data={data}
                      open={modal.changePassword}
                      onCancel={() => onModal("changePassword", false)}
                    />
                  </ChangePassword>
                )}
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
          onCancel={() => navigate(PATH_NAME.USERS)}
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
