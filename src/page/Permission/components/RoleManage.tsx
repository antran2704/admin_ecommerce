import { useTranslation } from "react-i18next";
import { RoleGroup } from "./index";
import { Fragment, useEffect, useMemo, useState } from "react";
import { IRoleItem, IRole, ICreateRole } from "~/interface/role";
import { createRole, deleteRole, updateRole } from "~/api-client/role";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ModalConfirm } from "~/components/Modal";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  selectedGroup: string | null;
  selectedValue: string | null;
  roles: IRoleItem[];
  listRole: IRole[];
  onSelectValue: (id: string, permissions: string[]) => void;
  handleGetRoles: () => Promise<void>;
}

const initData: ICreateRole = {
  name: "",
  groupId: "",
};

const RoleManage = (props: Props) => {
  const {
    selectedGroup = null,
    selectedValue,
    roles = [],
    listRole = [],
    onSelectValue,
    handleGetRoles,
  } = props;

  const { t, i18n } = useTranslation("PermissionPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      name: string().required(tError("PLEASE_INPUT")),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    clearErrors,
    setValue,
  } = useForm<ICreateRole>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
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
    const item = listRole.find((item: IRole) => item._id === id);

    onSelectValue(id, item?.permissions || []);
  };

  const onUpdateRole = async (id: string, value: string) => {
    const item = listRole.find((item: IRole) => item._id === id);

    if (!item) return;

    await updateRole(id, {
      name: value,
      groupId: item.groupId,
    })
      .then(() => {
        messageAntd.success(tSuccess("update"));
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 403) {
          messageAntd.error(tError(MESSAGE_ERROR.FORBIDDEN));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onDeleteRole = async (id: string) => {
    await deleteRole(id)
      .then(() => {
        messageAntd.success(tSuccess("delete"));
        // handleGetRoles(selectedGroup);
        handleGetRoles();
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 403) {
          messageAntd.error(tError(MESSAGE_ERROR.FORBIDDEN));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onSubmit = async (values: ICreateRole) => {
    onLoading("create", true);

    await createRole(values)
      .then(() => {
        // handleGetRoles(selectedGroup);
        handleGetRoles();
        onModal("create", false);
        reset();
        messageAntd.success(tSuccess("create"));
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 403) {
          messageAntd.error(tError(MESSAGE_ERROR.FORBIDDEN));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });

    onLoading("create", false);
  };

  useEffect(() => {
    if (!selectedGroup) {
      // setRoles([]);
      // setListRole([]);
      reset();
      return;
    }

    // handleGetRoles(selectedGroup);
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
            EPageRole.ADMIN_PAGE_ROLE,
          ),
          update: ability.can(
            EPermisisonAction.UPDATE,
            EPageRole.ADMIN_PAGE_ROLE,
          ),
          delete: ability.can(
            EPermisisonAction.DELETE,
            EPageRole.ADMIN_PAGE_ROLE,
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
        }}
      >
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
