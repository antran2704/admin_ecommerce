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
import { IStaffForm, ICreateStaffRequest } from "../interfaces";
import { initStaffForm } from "../common/staffForm";
import { createStaffSchema } from "../schema/creatStaff.schema";
import MESSAGE_ERROR from "~/common/errorMessage";
import { handleCheckValidPassword } from "~/helper/auth";
import { apiStaffService } from "~/api-client/staff";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_SUCCESS from "~/common/successMessage";

const CreateStaff = () => {
  const { t } = useTranslation("StaffPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const staffForm = useForm<IStaffForm>({
    defaultValues: initStaffForm,
    resolver: yupResolver(createStaffSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const onChangeAvartar = (file: File | null) => {
    if (!file) {
      staffForm.setValue("avatar", "");
    }

    staffForm.setValue("avatarFile", file);
  };

  const onSubmit = async (values: IStaffForm) => {
    const { inValid } = handleCheckValidPassword(values.password, tCommon);

    if (inValid.length) {
      return staffForm.setError("password", {
        message: inValid[0].title,
      });
    }

    if (values.password !== values.confirmPassword) {
      return staffForm.setError("confirmPassword", {
        message: tError(MESSAGE_ERROR.CONFIRM_PASSWORD_INCORRECT),
      });
    }

    const dataSend: ICreateStaffRequest = {
      name: values.name,
      role: values.role,
      email: values.email,
      password: values.password,
      avatar: values.avatar,
    };

    try {
      const isExitUser = await apiStaffService.isExitUser({
        email: values.email,
      });

      if (isExitUser) {
        messageAntd.error(tError("USER_EXISTED"));
        return;
      }

      if (values.avatarFile) {
        const newImage: string = await apiStaffService.uploadAvatar(
          values.avatarFile,
        );
        dataSend.avatar = newImage;
      }

      await apiStaffService.create(dataSend);

      messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      navigate("/staffs");
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
      backUrl="/staffs"
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: "/staffs" },
        { title: t("breadcrumb.create") },
      ]}>
      <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
        <div className="mx-auto">
          <div className="flex flex-col items-center">
            <UploadImage
              src={staffForm.watch("avatar")}
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
          <InforForm form={staffForm} />
        </div>
      </div>

      <FormFooter
        okText={tCommon("add")}
        cancelText={tCommon("cancel")}
        onOk={staffForm.handleSubmit(onSubmit, () => {
          messageAntd.error(tError(MESSAGE_ERROR.PLEASE_FILL_REQUIRED_FIELDS));
        })}
        onCancel={() => navigate("/staffs")}
        cancelProps={{
          disabled: staffForm.formState.isSubmitting,
        }}
        okProps={{
          loading: staffForm.formState.isSubmitting,
          disabled: staffForm.formState.isSubmitting,
        }}
      />
    </MainLayout>
  );
};

export default CreateStaff;
