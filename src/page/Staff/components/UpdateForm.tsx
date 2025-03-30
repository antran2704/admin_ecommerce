import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { TabsProps } from "antd";

import { FormFooter } from "~/components/Footer";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import {
  apiStaffService,
} from "~/api-client/staff";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import { LoadingLayout } from "~/layout";
import { ModalConfirm } from "~/components/Modal";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import UpdateStaffForm from "./UpdateStaffForm";
import Tabs from "~/components/Core/Tabs";

import { useAppSelector } from "~/store/hooks";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";
import { initStaffForm } from "../common/staffForm";
import { createStaffSchema } from "../schema/creatStaff.schema";
import { IStaffForm, IStaffResponse, IUpdateStaffRequest } from "../interfaces";

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

  const staffForm = useForm<IStaffForm>({
    defaultValues: initStaffForm,
    resolver: yupResolver(createStaffSchema(tError)) as any,
  });

  const { tab: tabParam } = useGetSearchParams({
    tab: "string",
  });

  const { messageAntd } = useMessageAntd();

  const [staff, setStaff] = useState<IStaffResponse | null>(null);
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

    return ability.can(EPermisisonAction.UPDATE, EPageRole.ADMIN_STAFF);
  };

  const handleGetStaff = async (id: string) => {
    onLoading("getData", true);

    await apiStaffService
      .staff(id)
      .then((payload: IStaffResponse) => {
        staffForm.reset({
          email: payload.email,
          name: payload.name,
          status: payload.isActive
            ? ENUM_ACCOUNT_STATUS.ACTIVE
            : ENUM_ACCOUNT_STATUS.INACTIVE,
          groupRole: payload.groupRoleId,
          role: payload.roleId,
          avatar: payload.avatar,
          avatarFile: null,
          password: "",
          confirmPassword: "",
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

  const onSubmit = async (values: IStaffForm) => {
    const dataSend: IUpdateStaffRequest = {
      name: values.name,
      role: values.role,
      avatar: values.avatar,
    };

    onLoading("submit", true);

    try {
      if (values.avatarFile) {
        const newImage: string = await apiStaffService.uploadAvatar(
          values.avatarFile,
        )
        values.avatar = newImage;

        staffForm.setValue("avatarFile", null);
      }

      // update infomation of staff
      await apiStaffService.update(staff.userId, dataSend);

      // update status of staff
      if (values.status === ENUM_ACCOUNT_STATUS.ACTIVE && !staff.isActive) {
        await apiStaffService.enable(staff.userId);
        setStaff({ ...staff, isActive: true });
      }

      if (values.status === ENUM_ACCOUNT_STATUS.INACTIVE && staff.isActive) {
        await apiStaffService.disable(staff.userId);
        setStaff({ ...staff, isActive: false });
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
    // {
    //   key: "1",
    //   label: t("tabs.detail"),
    //   children: staff && (
    //     <UpdateStaffForm
    //       dataForm={staffForm}
    //       data={staff}
    //       isEdit={isEdit}
    //       isOpenPasswordModal={modal.changePassword}
    //       onModalChangePassword={(value) => onModal("changePassword", value)}
    //       onChangeAvartar={onChangeAvartar}
    //     />
    //   ),
    // },
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
