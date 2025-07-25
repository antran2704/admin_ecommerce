import { useTranslation } from "react-i18next";
import { RoleGroup } from "./index";
import { Fragment, memo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyPrefix } from "i18next";

import { ModalConfirm } from "~/components/Modal";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";
import { apiGroupRoleService } from "~/api-client/role/groupRole";
import { IResponseDataWithPagination } from "~/interface";
import { groupRoleFormSchema } from "../schemas/roleGroupForm.schema";
import { initGroupRoleForm } from "../common/groupRoleForm";
import { IGroupRoleForm, IGroupRoleResponse, IRoleItem } from "../interfaces";
import MESSAGE_SUCCESS from "~/common/successMessage";

interface Props {
  selectedValue?: string | null;
  onSelectValue?: (id: string) => void;
}

const RoleGroupManage = (props: Props) => {
  const { selectedValue, onSelectValue } = props;

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
  } = useForm<IGroupRoleForm>({
    defaultValues: initGroupRoleForm,
    resolver: yupResolver(groupRoleFormSchema(tError)) as any,
  });

  const [roleGroups, setRoleGroups] = useState<IRoleItem[]>([]);

  const [modal, setModal] = useState<{ create: boolean }>({ create: false });
  const [loading, setLoading] = useState<{ create: boolean }>({
    create: false,
  });

  const { messageAntd } = useMessageAntd();

  const onModal = (key: keyof typeof modal, value: boolean) => {
    if (value === false) {
      reset();
      clearErrors();
    }

    setModal({ ...modal, [key]: value });
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const handleGetRoleGroups = async () => {
    await apiGroupRoleService
      .roleGroups()
      .then((payload: IResponseDataWithPagination<IGroupRoleResponse[]>) => {
        const data: IRoleItem[] = payload.data.map(
          (item: IGroupRoleResponse) => ({
            id: item.groupRoleId,
            name: item.name,
          }),
        );

        setRoleGroups(data);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);
        if (statusCode === 403) {
          messageAntd.error(
            tError(MESSAGE_ERROR.FORBIDDEN as KeyPrefix<"Error">),
          );
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onUpdateRoleGroup = async (id: string, value: string) => {
    await apiGroupRoleService
      .update(id, { name: value })
      .then(() => {
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      })
      .catch((err) => {
        const { message } = hanldeErrorAxios(err);

        if (message === "GROUP_ROLE_IS_EXISTED") {
          messageAntd.error(t("error.GROUP_ROLE_IS_EXISTED"));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onDeleteRoleGroup = async (id: string) => {
    await apiGroupRoleService
      .delete(id)
      .then(() => {
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.DELETED));
        handleGetRoleGroups();
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 403) {
          messageAntd.error(
            tError(MESSAGE_ERROR.FORBIDDEN as KeyPrefix<"Error">),
          );
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  const onSubmit = async (values: IGroupRoleForm) => {
    onLoading("create", true);

    await apiGroupRoleService
      .create(values)
      .then(() => {
        handleGetRoleGroups();
        onModal("create", false);
        reset();
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.CREATED));
      })
      .catch((err) => {
        const { message } = hanldeErrorAxios(err);

        if (message === "GROUP_ROLE_IS_EXISTED") {
          messageAntd.error(t("error.GROUP_ROLE_IS_EXISTED"));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
    onLoading("create", false);
  };

  useEffect(() => {
    handleGetRoleGroups();
  }, []);

  return (
    <Fragment>
      <RoleGroup
        title={t("groupRole")}
        data={roleGroups}
        notFoundMsg={tCommon("noData")}
        selectedValue={selectedValue}
        ability={{
          create: ability.can(
            EPermisisonAction.CREATE,
            EPageRole.ADMIN_GROUP_ROLE,
          ),
          update: ability.can(
            EPermisisonAction.UPDATE,
            EPageRole.ADMIN_GROUP_ROLE,
          ),
          delete: ability.can(
            EPermisisonAction.DELETE,
            EPageRole.ADMIN_GROUP_ROLE,
          ),
        }}
        onSelectValue={onSelectValue}
        onModalAdd={() => onModal("create", true)}
        onUpdateValue={onUpdateRoleGroup}
        onDelete={onDeleteRoleGroup}
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
                placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
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

export default memo(RoleGroupManage);
