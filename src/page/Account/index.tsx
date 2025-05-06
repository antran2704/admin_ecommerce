import { MainLayout } from "~/layout";
import { InfoUser, SidebarAccount } from "./components";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";

import { IProfileForm, IUpdateMeRequest } from "./interfaces";
import { initProfileForm } from "./common/form";
import { profileFormSchema } from "./schemas/form.schema";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import apiMeService from "~/api-client/me";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUserAsyncThunk, selectUserSlice } from "~/store/slice/user";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { ModalConfirm } from "~/components/Modal";

const AccountPage = () => {
  const { t } = useTranslation("AccountPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tSuccess } = useTranslation("Success");
  const { t: tError } = useTranslation("Error");

  const { messageAntd } = useMessageAntd();
  const dispatch = useAppDispatch();
  const { infoUser } = useAppSelector(selectUserSlice);

  const profileForm = useForm<IProfileForm>({
    defaultValues: initProfileForm,
    resolver: yupResolver(profileFormSchema(tError)) as any,
  });

  const [modal, setModal] = useState<{
    submit: boolean;
  }>({ submit: false });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ submit: boolean }>({
    submit: false,
  });

  const onModal = (type: keyof typeof modal, value: boolean) => {
    setModal({
      ...modal,
      [type]: value,
    });
  };

  const onLoading = (key: keyof typeof loading, status: boolean) => {
    setLoading({ ...loading, [key]: status });
  };

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const onSubmit = async (values: IProfileForm) => {
    onLoading("submit", true);

    try {
      if (values.avatarFile) {
        const newImage: string = await apiMeService.uploadAvatar(
          values.avatarFile,
        );
        values.avatar = newImage;

        profileForm.setValue("avatarFile", null);
      }

      const dataSend: IUpdateMeRequest = {
        name: values.name,
        avatar: values.avatar,
      };

      await apiMeService.update(dataSend);
      await dispatch(fetchUserAsyncThunk());

      onModal("submit", false);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    onLoading("submit", false);
  };

  useEffect(() => {
    if (!infoUser.userId) return;

    profileForm.reset({
      name: infoUser.name,
      avatar: infoUser.avatar,
      email: infoUser.email,
      groupRole: infoUser.groupRole,
      role: infoUser.role,
      status: infoUser.isActive
        ? ENUM_ACCOUNT_STATUS.ACTIVE
        : ENUM_ACCOUNT_STATUS.INACTIVE,
      createdAt: infoUser.createdAt,
    });
  }, [infoUser]);

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("title")}
      className="bg-white"
      listBreadcrumb={[
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      <div>
        <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
          <div className="mx-auto">
            {/* Side bar */}
            <SidebarAccount isEdit={isEdit} form={profileForm} />
          </div>

          {/* Content */}
          <div className="xl:w-10/12 w-full px-5">
            <InfoUser form={profileForm} isEdit={isEdit} />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white py-5 border-t">
          {isEdit && (
            <div className="flex items-center justify-end gap-5">
              <Button
                size="large"
                type={"default"}
                onClick={onEdit}
                className="w-[170px]"
              >
                {tCommon("cancel")}
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={() => onModal("submit", true)}
                loading={loading.submit}
                disabled={loading.submit}
                className="w-[170px]"
              >
                {tCommon("save")}
              </Button>
            </div>
          )}

          {!isEdit && (
            <div className="flex items-center justify-end gap-5">
              <Button
                size="large"
                type={"default"}
                href="/"
                className="w-[170px]"
              >
                {tCommon("goBack")}
              </Button>
              <Button
                size="large"
                type="primary"
                onClick={onEdit}
                className="w-[170px]"
              >
                {tCommon("update")}
              </Button>
            </div>
          )}

          <ModalConfirm
            title={t("modalUpdate.title")}
            subtitle={t("modalUpdate.subtitle")}
            open={modal.submit}
            onCancel={() => {
              onModal("submit", false);
            }}
            onOk={profileForm.handleSubmit(onSubmit)}
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
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
