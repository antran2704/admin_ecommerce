import { useTranslation } from "react-i18next";
import { RoleGroup } from "./index";
import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ICreateRoleGroup, IGroupRole } from "~/interface/role/group";
import {
  createRoleGroup,
  deleteRoleGroup,
  getRoleGroups,
  updateRoleGroup,
} from "~/api-client/role/groupRole";
import { IRoleItem } from "~/interface/role";

import { ModalConfirm } from "~/components/Modal";
import { InputText } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/error";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  selectedValue?: string | null;
  onSelectValue?: (id: string) => void;
}

const initData: ICreateRoleGroup = {
  name: "",
};

const RoleGroupManage = (props: Props) => {
  const { selectedValue, onSelectValue } = props;

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
  } = useForm<ICreateRoleGroup>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
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
    await getRoleGroups()
      .then((payload: IGroupRole[]) => {
        const data: IRoleItem[] = payload.map((item: IGroupRole) => ({
          id: item._id,
          name: item.name,
        }));

        setRoleGroups(data);
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

  const onUpdateRoleGroup = async (id: string, value: string) => {
    await updateRoleGroup(id, { name: value })
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

  const onDeleteRoleGroup = async (id: string) => {
    await deleteRoleGroup(id)
      .then(() => {
        messageAntd.success(tSuccess("delete"));
        handleGetRoleGroups();
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

  const onSubmit = async (values: ICreateRoleGroup) => {
    onLoading("create", true);

    await createRoleGroup(values)
      .then(() => {
        handleGetRoleGroups();
        onModal("create", false);
        reset();
        messageAntd.success(tSuccess("create"));
      })
      .catch((err) => err);
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
            EPageRole.ADMIN_PAGE_GROUP,
          ),
          update: ability.can(
            EPermisisonAction.UPDATE,
            EPageRole.ADMIN_PAGE_GROUP,
          ),
          delete: ability.can(
            EPermisisonAction.DELETE,
            EPageRole.ADMIN_PAGE_GROUP,
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

export default memo(RoleGroupManage);
