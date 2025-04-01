import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { yupResolver } from "@hookform/resolvers/yup";

import { MainLayout } from "~/layout";
import { InforForm } from "../components";
import { FormFooter } from "~/components/Footer";
import useMessageAntd from "~/hooks/useMessageAntd";
import { UploadImage } from "~/components/Core";
import { ETypeFile } from "~/enum/file";
import MESSAGE_ERROR from "~/common/errorMessage";
import { handleCheckValidPassword } from "~/helper/auth";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { ICreateUserRequest, IUserForm } from "../interfaces";
import { initUserForm } from "../common/userForm";
import { createUserSchema } from "../schema/creatUser.schema";
import { apiUserService } from "~/api-client/user";
import { ENUM_USER_PROVIDER } from "../enums";
import PATH_NAME from "~/routes/paths";

const CreatePage = () => {
  const { t } = useTranslation("UserPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const form = useForm<IUserForm>({
    defaultValues: initUserForm,
    resolver: yupResolver(createUserSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onChangeAvartar = (file: File | null) => {
    if (!file) {
      form.setValue("avatar", "");
    }

    form.setValue("avatarFile", file);
  };

  const onSubmit = async (values: IUserForm) => {
    console.log("values:::", values)
    const { inValid } = handleCheckValidPassword(values.password, tCommon);

    if (inValid.length) {
      return form.setError("password", {
        message: inValid[0].title,
      });
    }

    if (values.password !== values.confirmPassword) {
      return form.setError("confirmPassword", {
        message: tError(MESSAGE_ERROR.CONFIRM_PASSWORD_INCORRECT),
      });
    }

    const dataSend: ICreateUserRequest = {
      name: values.name,
      email: values.email,
      birthday: values.birthday,
      phoneNumber: values.phoneNumber,
      password: values.password,
      avatar: values.avatar,
    };

    try {
      const isExitUser = await apiUserService.isExitUser({
        email: values.email,
        provider: ENUM_USER_PROVIDER.SYSTEM,
      });

      if (isExitUser) {
        messageAntd.error(tError("USER_EXISTED"));
        return;
      }

      if (values.avatarFile) {
        const newImage: string = await apiUserService.uploadAvatar(
          values.avatarFile,
        );
        dataSend.avatar = newImage;
      }

      await apiUserService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate(PATH_NAME.USERS);
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "USER_EXISTED") {
        messageAntd.error(tError("USER_EXISTED"));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }
  };

  return (
    <MainLayout
      titleText={t("createTitle")}
      className="bg-white"
      backUrl={PATH_NAME.USERS}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.USERS },
        { title: t("breadcrumb.create") },
      ]}>
      <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
        <div className="mx-auto">
          <div className="flex flex-col items-center">
            <UploadImage
              src={form.watch("avatar")}
              className={clsx(
                "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px] rounded-full",
              )}
              onChangeImage={onChangeAvartar}
              rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
            />
          </div>
        </div>

        {/* Form */}
        <div className="xl:w-10/12 w-full px-5">
          <InforForm form={form} />
        </div>
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
