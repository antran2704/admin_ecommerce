import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useEffect } from "react";

import { DAY_DMY } from "~/common/format";
import { SelectFilter } from "~/components/Core";
import { InputPassword, InputText } from "~/components/Core/Input";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import {
  IRoleResponse,
  IGroupRoleResponse,
} from "~/page/Permission/interfaces";
import { IStaffForm, IStaffResponse } from "../interfaces";
import { useScrollGroupRoles, useScrollRoles } from "~/page/Permission/hooks";

interface Props {
  data?: IStaffResponse;
  form: UseFormReturn<IStaffForm, any, undefined>;
  isEdit?: boolean;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true } = props;
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
  } = form;

  const { t } = useTranslation("StaffPage");
  const { t: tError } = useTranslation("Error");

  // get group roles
  const { groupRoles } = useScrollGroupRoles();

  // get roles
  const { roles, setParameterRoles } = useScrollRoles();

  useEffect(() => {
    if (!data) return;

    setParameterRoles({ groupRoleId: data.groupRoleId });
  }, [data]);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-2 gap-14">
      {/* first column */}
      <div className="flex flex-col gap-4">
        {/* User id */}
        {data && (
          <div className="flex flex-col">
            <InputText
              title={t("form.userId")}
              placeholder={tError("PLEASE_INPUT")}
              required={true}
              sizeText="small"
              value={data.userId}
              disabled
            />
          </div>
        )}

        {/* Name */}
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
              disabled={!isEdit}
              {...field}
            />
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.email")}
              placeholder={tError("PLEASE_INPUT")}
              required={true}
              error={!!errors.email}
              errorMessage={errors.email?.message}
              sizeText="small"
              disabled={!!data}
              {...field}
            />
          )}
        />
      </div>

      {/* second column */}
      <div className="flex flex-col gap-4">
        {/*  Role group */}
        <Controller
          name="groupRole"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <SelectFilter
              title={t("form.groupRole")}
              placeholder={tError("PLEASE_SELECT")}
              className="w-full"
              options={groupRoles.map((role: IGroupRoleResponse) => ({
                label: role.name,
                value: role.groupRoleId,
              }))}
              error={!!errors.groupRole}
              errorMessage={errors.groupRole?.message}
              sizeText="small"
              required={true}
              onChange={(value) => {
                onChange(value);
                setValue("role", "");
                setParameterRoles({ groupRoleId: value });
              }}
              value={value || null}
              disabled={!isEdit}
              {...rest}
            />
          )}
        />

        {/*  Role */}
        <Controller
          name="role"
          control={control}
          render={({ field: { value, ...rest } }) => (
            <SelectFilter
              title={t("form.role")}
              placeholder={tError("PLEASE_SELECT")}
              className="w-full"
              options={roles.map((role: IRoleResponse) => ({
                label: role.name,
                value: role.roleId,
              }))}
              error={!!errors.role}
              errorMessage={errors.role?.message}
              sizeText="small"
              required={true}
              disabled={!getValues("groupRole") || !isEdit}
              value={value || null}
              {...rest}
            />
          )}
        />
      </div>

      {/* third column */}
      <div className="flex flex-col gap-4">
        {/*  Status */}
        {data && (
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SelectFilter
                title={t("form.status")}
                placeholder={tError("PLEASE_SELECT")}
                className="w-full"
                options={[
                  {
                    label: t("filter.active"),
                    value: ENUM_ACCOUNT_STATUS.ACTIVE,
                  },
                  {
                    label: t("filter.inactive"),
                    value: ENUM_ACCOUNT_STATUS.INACTIVE,
                  },
                ]}
                error={!!errors.status}
                errorMessage={errors.status?.message}
                sizeText="small"
                required={true}
                disabled={
                  !isEdit ||
                  !ability.can(
                    EPermisisonAction.ENABLE,
                    EPageRole.ADMIN_STAFF,
                  ) ||
                  !ability.can(EPermisisonAction.DISABLE, EPageRole.ADMIN_STAFF)
                }
                {...field}
              />
            )}
          />
        )}

        {/* Create Password */}
        {!data && (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <InputPassword
                title={t("form.createPassword")}
                placeholder={tError("PLEASE_INPUT")}
                error={!!errors.password}
                errorMessage={errors.password?.message}
                sizeText="small"
                required
                {...field}
              />
            )}
          />
        )}

        {/* Confirm Password */}
        {!data && (
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <InputPassword
                title={t("form.confirmPassword")}
                placeholder={tError("PLEASE_INPUT")}
                error={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
                sizeText="small"
                required
                {...field}
              />
            )}
          />
        )}

        {/* Created at */}
        {data && (
          <InputText
            title={t("form.createdAt")}
            placeholder={tError("PLEASE_INPUT")}
            sizeText="small"
            value={dayjs(data.createdAt).format(DAY_DMY)}
            disabled
          />
        )}
      </div>
    </div>
  );
};

export default InfoForm;
