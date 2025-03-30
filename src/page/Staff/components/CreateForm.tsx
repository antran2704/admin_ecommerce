import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { ICreateStaff, IFormStaff } from "~/interface/staff";
import dayjs from "dayjs";
import { TabsProps } from "antd";
import axios from "axios";

import { FormFooter } from "~/components/Footer";
import { ENUM_TYPE_SETUP_PASSWORD } from "~/enum/user";
import { handleCheckValidPassword } from "~/helper/auth";
import { createStaff } from "~/api-client/staff";
import { DAY_DMY } from "~/common/format";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { combinePhoneNumber } from "~/helper/phoneNumber";
import { initStaffForm } from "../common/staff";
import { staffSchema } from "../schema/staff";
import Tabs from "~/components/Core/Tabs";
import CreateStaffForm from "./CreateStaffForm";

const CreateForm = () => {
  const { t } = useTranslation("StaffPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const staffForm = useForm<IFormStaff>({
    defaultValues: initStaffForm,
    resolver: yupResolver(staffSchema(tError)) as any,
  });

  const { messageAntd } = useMessageAntd();

  const [avartar, setAvartar] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeAvartar = (file: File | null) => {
    setAvartar(file);
  };


  const onSubmit = async (values: IFormStaff) => {
    if (values.isPasswordGenerated === ENUM_TYPE_SETUP_PASSWORD.MANUAL) {
      if (!values.password) {
        return staffForm.setError("password", {
          message: tError(MESSAGE_ERROR.PLEASE_SELECT),
        });
      }
      const { inValid } = handleCheckValidPassword(values.password, tCommon);

      if (inValid.length) {
        return staffForm.setError("password", {
          message: inValid[0].title,
        });
      }

      if (!values.confirmPassword) {
        return staffForm.setError("confirmPassword", {
          message: tError(MESSAGE_ERROR.PLEASE_SELECT),
        });
      }

      if (values.password !== values.confirmPassword) {
        return staffForm.setError("confirmPassword", {
          message: tError(MESSAGE_ERROR.CONFIRM_PASSWORD_INCORRECT),
        });
      }
    }

    const dataSend: ICreateStaff = {
      fullName: values.fullName,
      roles: values.roles ? [values.roles] : [],
      email: values.email,
      address: values.address,
      isPasswordGenerated:
        values.isPasswordGenerated === ENUM_TYPE_SETUP_PASSWORD.EMAIL
          ? true
          : false,
      password: values.password,
      gender: values.gender,
      imageProfile: avartar ? avartar.lastModified.toString() : "",
      workLocationId: values.workLocationId,
      clientId: values.clientId,
    };

    if (values.phoneNumber) {
      const phoneNumber: string = values.phoneNumber
        ? combinePhoneNumber(values.codeArea, values.phoneNumber)
        : "";
      dataSend.phoneNumber = phoneNumber;
    }

    if (values.dateOfBirth) {
      dataSend.dateOfBirth = dayjs(values.dateOfBirth, DAY_DMY).toISOString();
    }

    if (values.startDate) {
      dataSend.startDate = dayjs(values.startDate, DAY_DMY).toISOString();
    }

    if (values.endDate) {
      dataSend.endDate = dayjs(values.endDate, DAY_DMY).toISOString();
    }

    setLoading(true);

    try {
      const { presignedUrl, userId } = await createStaff(dataSend);

      if (avartar && presignedUrl.length > 0) {
        await axios.put(presignedUrl[0], avartar, {
          headers: {
            "Content-Type": avartar.type,
          },
        });
      }

      messageAntd.success(tSuccess("create"));
      navigate("/staffs");
    } catch (err) {
      const { message, statusCode } = hanldeErrorAxios(err);

      if (statusCode === 400 && message === "ADMIN_IS_EXISTED") {
        messageAntd.error(tError(message));
      } else if (statusCode === 403) {
        messageAntd.error(tError(MESSAGE_ERROR.FORBIDDEN));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    setLoading(false);
  };

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: t("tabs.detail"),
      children: (
        <CreateStaffForm
          dataForm={staffForm}
          onChangeAvartar={onChangeAvartar}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs items={tabs} />

      <FormFooter
        okText={tCommon("add")}
        cancelText={tCommon("cancel")}
        onOk={staffForm.handleSubmit(onSubmit, () => {
          messageAntd.error(tError(MESSAGE_ERROR.PLEASE_FILL_ALL_FIELDS));
        })}
        onCancel={() => navigate("/staffs")}
        cancelProps={{
          disabled: loading,
        }}
        okProps={{
          loading,
          disabled: loading,
        }}
      />
    </div>
  );
};

export default CreateForm;
