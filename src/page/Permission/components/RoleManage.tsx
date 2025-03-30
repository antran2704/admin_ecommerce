import { useTranslation } from "react-i18next";
import { RoleGroup } from "./index";
import { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ModalConfirm } from "~/components/Modal";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";
import { ICreateRoleRequest, IRoleResponse, IRoleForm, IRoleItem } from "../interfaces";
import { initRoleForm } from "../common/roleForm";
import { roleFormSchema } from "../schemas/roleForm.schema";
import apiRoleService from "~/api-client/role/role";
import MESSAGE_SUCCESS from "~/common/successMessage";

interface Props {
  selectedGroup: string | null;
  selectedValue: string | null;
  roles: IRoleItem[];
  listRole: IRoleResponse[];
  onSelectValue: (id: string, permissions: string[]) => void;
  handleGetRoles: () => Promise<void>;
}

const RoleManage = (props: Props) => {
  const {
    selectedGroup = null,
    selectedValue,
    roles = [],
    listRole = [],
    onSelectValue,
    handleGetRoles,
  } = props;

  const { t } = useTranslation("PermissionPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    setValue,
  } = useForm<IRoleForm>({
    defaultValues: initRoleForm,
    resolver: yupResolver(roleFormSchema(tError)) as any,
  });

  const [modal, setModal] = useState<{ create: boolean }>({ create: false });
  const [loading, setLoading] = useState<{ create: boolean }>({
    create: false,
  });

  const { messageAntd } = useMessageAntd();

  const onModal = (key: keyof typeof modal, value: boolean) => {
    if (value === false) {
      reset({ groupId: selectedGroup, name: "" });
      clearErrors();
    }

    setModal({ ...modal, [key]: value });
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onSelectRoleItem = (id: string) => {
    const item = listRole.find((item: IRoleResponse) => item.roleId === id);

    onSelectValue(id, item?.permissions || []);
  };

  const onUpdateRole = async (id: string, value: string) => {
    const item = listRole.find((item: IRoleResponse) => item.roleId === id);

    if (!item) return;

    await apiRoleService
      .update(id, {
        name: value
      })
      .then(() => {
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      })
      .catch((err) => {
        const { message } = hanldeErrorAxios(err);

        if(message === "ROLE_NAME_IS_EXISTED") {
          messageAntd.error(t("error.ROLE_NAME_IS_EXISTED"));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onDeleteRole = async (id: string) => {
    await apiRoleService
      .delete(id)
      .then(() => {
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.DELETED));
        handleGetRoles();
      })
      .catch((err) => {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      });
  };

  const onSubmit = async (values: IRoleForm) => {
    const dataSend: ICreateRoleRequest = {
      groupRoleId: values.groupId,
      name: values.name,
    }

    onLoading("create", true);

    await apiRoleService.create(dataSend)
      .then(() => {
        handleGetRoles();
        onModal("create", false);
        reset();
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      })
      .catch((err) => {
        const { message } = hanldeErrorAxios(err);

        if(message === "ROLE_NAME_IS_EXISTED") {
          messageAntd.error(t("error.ROLE_NAME_IS_EXISTED"));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });

    onLoading("create", false);
  };

  useEffect(() => {
    if (!selectedGroup) {
      reset();
      return;
    }

    setValue("groupId", selectedGroup);
  }, [selectedGroup]);

  return (
    <Fragment>
      <RoleGroup
        title={t("role")}
        data={roles}
        notFoundMsg={
          selectedGroup && roles.length === 0
            ? tCommon("noData")
            : t("notFoundPermission")
        }
        selectedValue={selectedValue}
        showBtnAdd={!!selectedGroup}
        ability={{
          create: ability.can(
            EPermisisonAction.CREATE,
            EPageRole.ADMIN_ROLE,
          ),
          update: ability.can(
            EPermisisonAction.UPDATE,
            EPageRole.ADMIN_ROLE,
          ),
          delete: ability.can(
            EPermisisonAction.DELETE,
            EPageRole.ADMIN_ROLE,
          ),
        }}
        onSelectValue={onSelectRoleItem}
        onModalAdd={() => onModal("create", true)}
        onUpdateValue={onUpdateRole}
        onDelete={onDeleteRole}
      />

      <ModalConfirm
        title={t("modalCreateGroupRole.title")}
        open={modal.create}
        type="info"
        onCancel={() => onModal("create", false)}
        onOk={handleSubmit(onSubmit)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          loading: loading.create,
          disabled: loading.create,
        }}>
        <div className="pb-5">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.name")}
                placeholder={tError("PLEASE_INPUT")}
                required={true}
                error={!!errors.name}
                errorMessage={errors.name?.message}
                sizeText="small"
                onPressEnter={handleSubmit(onSubmit)}
                {...field}
              />
            )}
          />
        </div>
      </ModalConfirm>
    </Fragment>
  );
};

export default RoleManage;
