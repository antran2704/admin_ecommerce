import { yupResolver } from "@hookform/resolvers/yup";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { IFormStaff, IStaff, IUpdateStaff } from "~/interface/staff";
import dayjs from "dayjs";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, TabsProps } from "antd";

import { FormFooter } from "~/components/Footer";
import { ENUM_ACCOUNT_STATUS, ENUM_TYPE_SETUP_PASSWORD } from "~/enum/user";
import {
  disableStaff,
  enableStaff,
  getStaff,
  presignedUrlStaff,
  updateStaff,
} from "~/api-client/staff";
import { DAY_DMY } from "~/common/format";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import { LoadingLayout } from "~/layout";
import { ModalConfirm } from "~/components/Modal";
import {
  combinePhoneNumber,
  getPhoneNumberAndCodeArea,
} from "~/helper/phoneNumber";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { initStaffForm } from "../common/staff";
import { staffSchema } from "../schema/staff";
import UpdateStaffForm from "./UpdateStaffForm";
import Tabs from "~/components/Core/Tabs";

import { useAppSelector } from "~/store/hooks";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";

interface Props {
  staffId: string;
  isEdit?: boolean;
  onEdit?: () => void;
}

const UpdateForm = (props: Props) => {
  const { staffId, isEdit = false, onEdit } = props;

  const { t } = useTranslation("StaffPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { infoUser } = useAppSelector((state) => state.user);

  const staffForm = useForm<IFormStaff>({
    defaultValues: initStaffForm,
    resolver: yupResolver(staffSchema(tError)) as any,
  });

  const { tab: tabParam } = useGetSearchParams({
    tab: "string",
  });

  const { messageAntd } = useMessageAntd();

  const [staff, setStaff] = useState<IStaff | null>(null);
  const [avartar, setAvartar] = useState<File | null>(null);

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
    setAvartar(file);
  };

  const onTabChange = (key: string) => {
    navigate(pathname + parseQueryString({ tab: key }));
  };

  const canEditForm = (recordId: string, userId: string) => {
    if (userId === "AC2512242171") {
      return true;
    }

    if (recordId === userId) {
      return true;
    }

    if (recordId === "AC2512246370" || recordId === "AC2512242171") {
      return false;
    }

    return ability.can(
      EPermisisonAction.UPDATE,
      EPageRole.ADMIN_PAGE_MANAGE_USER,
    );
  };

  const handleGetStaff = async (id: string) => {
    onLoading("getData", true);

    await getStaff(id)
      .then((payload: IStaff) => {
        const { codeArea, phone } = getPhoneNumberAndCodeArea(
          payload.phoneNumber,
        );

        staffForm.reset({
          address: payload.address,
          confirmPassword: "",
          dateOfBirth: payload.dateOfBirth
            ? dayjs(payload.dateOfBirth).format(DAY_DMY)
            : "",
          email: payload.email,
          endDate: payload.endDate
            ? dayjs(payload.endDate).format(DAY_DMY)
            : "",
          startDate: payload.startDate
            ? dayjs(payload.startDate).format(DAY_DMY)
            : "",
          fullName: payload.fullName,
          gender: payload.gender,
          isPasswordGenerated: ENUM_TYPE_SETUP_PASSWORD.EMAIL,
          status: payload.isActive
            ? ENUM_ACCOUNT_STATUS.ACTIVE
            : ENUM_ACCOUNT_STATUS.INACTIVE,
          password: "",
          groupRole: payload.groupIds[0],
          roles: payload.roles[0],
          phoneNumber: phone,
          codeArea,
          clientId: payload.clientId || "",
          workLocationId: payload.workLocationId,
        });
        setStaff(payload);
        onLoading("getData", false);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          navigate("/staffs");
        }
      });
  };


  const onSubmit = async (values: IFormStaff) => {
    const phoneNumber: string = values.phoneNumber
      ? combinePhoneNumber(values.codeArea, values.phoneNumber)
      : "";

    const dataSend: IUpdateStaff = {
      fullName: values.fullName,
      roles: values.roles ? [values.roles] : [],
      address: values.address,
      gender: values.gender,
      phoneNumber: phoneNumber,
      workLocationId: values.workLocationId,
      clientId: values.clientId,
    };

    if (values.dateOfBirth) {
      dataSend.dateOfBirth = dayjs(values.dateOfBirth, DAY_DMY).toISOString();
    }

    if (values.startDate) {
      dataSend.startDate = dayjs(values.startDate, DAY_DMY).toISOString();
    }

    if (values.endDate) {
      dataSend.endDate = dayjs(values.endDate, DAY_DMY).toISOString();
    }

    onLoading("submit", true);

    try {
      // update infomation of staff
      await updateStaff(staff.userId, dataSend);

      // update status of staff
      if (values.status === ENUM_ACCOUNT_STATUS.ACTIVE && !staff.isActive) {
        await enableStaff(staff.userId);
        setStaff({ ...staff, isActive: true });
      }

      if (values.status === ENUM_ACCOUNT_STATUS.INACTIVE && staff.isActive) {
        await disableStaff(staff.userId);
        setStaff({ ...staff, isActive: false });
      }

      // update avartar of staff
      if (avartar) {
        const fileName: string = staff.imageProfile
          ? staff.imageProfile.fileName
          : avartar.lastModified.toString();

        const newUrl: string = await presignedUrlStaff(staff.userId, fileName);

        if (!newUrl) return;

        await axios.put(newUrl, avartar, {
          headers: {
            "Content-Type": avartar.type,
          },
        });

        setAvartar(null);
      }

      onModal("submit", false);
      messageAntd.success(tSuccess("update"));
    } catch (err) {
      const { message } = hanldeErrorAxios(err);

      if (message === "ADMIN_IS_EXISTED" || message === "OFFICE_NOT_FOUND") {
        messageAntd.error(tError(message));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading("submit", false);
  };

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: t("tabs.detail"),
      children: staff && (
        <UpdateStaffForm
          dataForm={staffForm}
          data={staff}
          isEdit={isEdit}
          isOpenPasswordModal={modal.changePassword}
          onModalChangePassword={(value) => onModal("changePassword", value)}
          onChangeAvartar={onChangeAvartar}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!staffId) return;

    handleGetStaff(staffId);
  }, [staffId]);

  return (
    <LoadingLayout loading={loading.getData}>
      <Tabs
        items={tabs}
        activeKey={tabParam ? (tabParam as string) : "1"}
        onChange={onTabChange}
      />

      {isEdit && (
        <FormFooter
          okText={tCommon("save")}
          cancelText={tCommon("cancel")}
          onOk={staffForm.handleSubmit(
            () => onModal("submit", true),
            () => {
              messageAntd.error(tError(MESSAGE_ERROR.PLEASE_FILL_ALL_FIELDS));
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
          okProps={{
            className: !canEditForm(staffId, infoUser.userId) && "hidden",
          }}
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
        onOk={staffForm.handleSubmit(onSubmit)}
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
    </LoadingLayout>
  );
};

export default UpdateForm;
