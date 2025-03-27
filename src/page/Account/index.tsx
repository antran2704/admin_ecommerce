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

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<{ submit: boolean }>({
    submit: false,
  });

  const onLoading = (key: keyof typeof loading, status: boolean) => {
    setLoading({ ...loading, [key]: status });
  };

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const onSubmit = async (values: IProfileForm) => {
    onLoading("submit", true);

    const dataSend: IUpdateMeRequest = {
      name: values.name,
      avatar: values.avatar,
    };

    await apiMeService
      .update(dataSend)
      .then(async () => {
        await dispatch(fetchUserAsyncThunk());
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      })
      .catch(() => {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      });

    onLoading("submit", false);
  };

  useEffect(() => {
    if(!infoUser.userId) return; 

    profileForm.reset({
      name: infoUser.name,
      avatar: infoUser.avatar,
      email: infoUser.email,
      groupRole: infoUser.groupRole,
      role: infoUser.role,
      status: infoUser.isActive ? ENUM_ACCOUNT_STATUS.ACTIVE : ENUM_ACCOUNT_STATUS.INACTIVE,
      createdAt: infoUser.createdAt,
    })

  }, [infoUser])

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("title")}
      className="bg-white"
      listBreadcrumb={[
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}>
      <div>
        <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
          <div className="mx-auto">
            {/* Side bar */}
            <SidebarAccount isEdit={isEdit} />
          </div>

          {/* Content */}
          <div className="xl:w-10/12 w-full px-5">
            <InfoUser form={profileForm} isEdit={isEdit} />
          </div>
        </div>
        {isEdit && (
          <div className="flex items-center justify-end pt-5 gap-5">
            <Button
              size="large"
              type={"default"}
              onClick={onEdit}
              className="w-[170px]">
              {tCommon("cancel")}
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={profileForm.handleSubmit(onSubmit)}
              loading={loading.submit}
              disabled={loading.submit}
              className="w-[170px]">
              {tCommon("save")}
            </Button>
          </div>
        )}

        {!isEdit && (
          <div className="flex items-center justify-end pt-5 gap-5">
            <Button
              size="large"
              type={"default"}
              href="/"
              className="w-[170px]">
              {tCommon("goBack")}
            </Button>
            <Button
              size="large"
              type="primary"
              onClick={onEdit}
              className="w-[170px]">
              {tCommon("update")}
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AccountPage;
