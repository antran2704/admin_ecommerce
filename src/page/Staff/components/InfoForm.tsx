import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useEffect } from "react";

import { DAY_DMY } from "~/common/format";
import { DateFilter, SelectFilter } from "~/components/Core";
import { InputPassword, InputPhone, InputText } from "~/components/Core/Input";
import {
  ENUM_ACCOUNT_STATUS,
  ENUM_GENDER,
  ENUM_TYPE_SETUP_PASSWORD,
} from "~/enum/user";
import { IFormStaff, IStaff } from "~/interface/staff";
import { useGroupRoles, useRoles } from "~/hooks/roles";
import { IGroupRole } from "~/interface/role/group";
import { IRole } from "~/interface/role";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { EOrderType } from "~/enum/paramater";

interface Props {
  data?: IStaff;
  form: UseFormReturn<IFormStaff, any, undefined>;
  isEdit?: boolean;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true } = props;
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = form;

  const { t } = useTranslation("StaffPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tFilter } = useTranslation("Filter");
  const { t: tError } = useTranslation("Error");

  // get group roles
  const { groupRoles } = useGroupRoles();

  // get roles
  const { roles, setParameterRole } = useRoles();

  useEffect(() => {
    if (!data) return;

    setParameterRole({ groupId: data.groupIds[0] });
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
        <div className="flex flex-col">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.name")}
                placeholder={tError("PLEASE_INPUT")}
                required={true}
                error={!!errors.fullName}
                errorMessage={errors.fullName?.message}
                sizeText="small"
                disabled={!isEdit}
                {...field}
              />
            )}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
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

        {/* Phone number */}
        <div className="flex flex-col">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <InputPhone
                title={t("form.phone")}
                placeholder={tError("PLEASE_INPUT")}
                error={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber?.message}
                sizeText="small"
                maxLength={11}
                type="phoneNumber"
                codeArea={watch("codeArea")}
                onChangeCodeArea={(value) => setValue("codeArea", value)}
                disabled={!isEdit}
                {...field}
              />
            )}
          />
        </div>

      </div>

      {/* second column */}
      <div className="flex flex-col gap-4">
        {/* Date of birth */}
        <div className="flex flex-col">
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <DateFilter
                title={t("form.dateOfBirth")}
                placeholder={tError("PLEASE_SELECT")}
                error={!!errors.dateOfBirth}
                errorMessage={errors.dateOfBirth?.message}
                sizeText="small"
                format={DAY_DMY}
                value={value ? dayjs(value, DAY_DMY) : null}
                onChange={(date) => onChange(date.format(DAY_DMY))}
                disabled={!isEdit}
                {...rest}
              />
            )}
          />
        </div>

        {/* Gender */}
        <div>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <SelectFilter
                title={t("form.gender")}
                placeholder={tError("PLEASE_SELECT")}
                className="w-full"
                options={[
                  { label: tFilter("male"), value: ENUM_GENDER.MALE },
                  { label: tFilter("female"), value: ENUM_GENDER.FEMALE },
                ]}
                error={!!errors.gender}
                errorMessage={errors.gender?.message}
                sizeText="small"
                disabled={!isEdit}
                {...field}
              />
            )}
          />
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.address")}
                placeholder={tError("PLEASE_INPUT")}
                error={!!errors.address}
                errorMessage={errors.address?.message}
                sizeText="small"
                disabled={!isEdit}
                {...field}
              />
            )}
          />
        </div>

        {/*  Role group */}
        <div className="flex flex-col">
          <Controller
            name="groupRole"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <SelectFilter
                title={t("form.groupRole")}
                placeholder={tError("PLEASE_SELECT")}
                className="w-full"
                options={groupRoles.map((role: IGroupRole) => ({
                  label: role.name,
                  value: role._id,
                }))}
                error={!!errors.groupRole}
                errorMessage={errors.groupRole?.message}
                sizeText="small"
                required={true}
                onChange={(value) => {
                  onChange(value);
                  setValue("roles", "");
                  setParameterRole({ groupId: value });
                }}
                value={value || null}
                disabled={!isEdit}
                {...rest}
              />
            )}
          />
        </div>
      </div>

      {/* third column */}
      <div className="flex flex-col gap-4">
        {/*  Role */}
        <div className="flex flex-col">
          <Controller
            name="roles"
            control={control}
            render={({ field: { value, ...rest } }) => (
              <SelectFilter
                title={t("form.role")}
                placeholder={tError("PLEASE_SELECT")}
                className="w-full"
                options={roles.map((role: IRole) => ({
                  label: role.name,
                  value: role._id,
                }))}
                error={!!errors.roles}
                errorMessage={errors.roles?.message}
                sizeText="small"
                required={true}
                disabled={!getValues("groupRole") || !isEdit}
                value={value || null}
                {...rest}
              />
            )}
          />
        </div>

        {/*  Status */}
        {data && (
          <div className="flex flex-col">
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
                      EPageRole.ADMIN_PAGE_MANAGE_USER,
                    ) ||
                    !ability.can(
                      EPermisisonAction.DISABLE,
                      EPageRole.ADMIN_PAGE_MANAGE_USER,
                    )
                  }
                  {...field}
                />
              )}
            />
          </div>
        )}

        {/* Start - End date */}
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
          {/* Started at */}
          <div className="flex flex-col">
            <Controller
              name="startDate"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <DateFilter
                  title={t("form.startedAt")}
                  placeholder={tError("PLEASE_SELECT")}
                  error={!!errors.startDate}
                  errorMessage={errors.startDate?.message}
                  sizeText="small"
                  format={DAY_DMY}
                  value={value ? dayjs(value, DAY_DMY) : null}
                  onChange={(date) => onChange(date.format(DAY_DMY))}
                  allowClear={false}
                  disabled={!isEdit}
                  {...rest}
                />
              )}
            />
          </div>

          {/* Ended at */}
          <div className="flex flex-col">
            <Controller
              name="endDate"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <DateFilter
                  title={t("form.endedAt")}
                  placeholder={tError("PLEASE_SELECT")}
                  error={!!errors.endDate}
                  errorMessage={errors.endDate?.message}
                  sizeText="small"
                  format={DAY_DMY}
                  value={value ? dayjs(value, DAY_DMY) : null}
                  onChange={(date) => onChange(date.format(DAY_DMY))}
                  allowClear={false}
                  disabled={!isEdit}
                  {...rest}
                />
              )}
            />
          </div>
        </div>

        {/*  Password */}
        {!data && (
          <div className="flex flex-col">
            <Controller
              name="isPasswordGenerated"
              control={control}
              render={({ field }) => (
                <SelectFilter
                  title={t("form.password")}
                  placeholder={tError("PLEASE_SELECT")}
                  className="w-full"
                  options={[
                    {
                      label: tCommon("sendPasswordToEmail"),
                      value: ENUM_TYPE_SETUP_PASSWORD.EMAIL,
                    },
                    {
                      label: tCommon("manualSetupPassword"),
                      value: ENUM_TYPE_SETUP_PASSWORD.MANUAL,
                    },
                  ]}
                  error={!!errors.isPasswordGenerated}
                  errorMessage={errors.isPasswordGenerated?.message}
                  sizeText="small"
                  required={true}
                  defaultValue={ENUM_TYPE_SETUP_PASSWORD.EMAIL}
                  {...field}
                  value={watch("isPasswordGenerated")}
                />
              )}
            />
          </div>
        )}

        {/* Create Password */}
        {getValues("isPasswordGenerated") ===
          ENUM_TYPE_SETUP_PASSWORD.MANUAL && (
          <div className="flex flex-col">
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
          </div>
        )}

        {/* Confirm Password */}
        {getValues("isPasswordGenerated") ===
          ENUM_TYPE_SETUP_PASSWORD.MANUAL && (
          <div className="flex flex-col">
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
          </div>
        )}

        {/* Created at */}
        {data && (
          <div className="flex flex-col">
            <InputText
              title={t("form.createdAt")}
              placeholder={tError("PLEASE_INPUT")}
              sizeText="small"
              value={dayjs(data.createdAt).format(DAY_DMY)}
              disabled
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoForm;
