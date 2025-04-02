import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { DAY_DMY } from "~/common/format";
import { DateSelect, SelectFilter } from "~/components/Core";
import { InputPassword, InputText } from "~/components/Core/Input";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { IUserForm, IUserResponse } from "../interfaces";

interface Props {
  data?: IUserResponse;
  form: UseFormReturn<IUserForm, any, undefined>;
  isEdit?: boolean;
}

const InfoForm = (props: Props) => {
  const { form, data, isEdit = true } = props;
  const {
    control,
    formState: { errors },
  } = form;

  const { t } = useTranslation("UserPage");
  const { t: tFilter } = useTranslation("Filter");
  const { t: tError } = useTranslation("Error");

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
        {/* Phone number */}
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <InputText
              title={t("form.phone")}
              placeholder={tError("PLEASE_INPUT")}
              error={!!errors.phoneNumber}
              errorMessage={errors.phoneNumber?.message}
              sizeText="small"
              type="number"
              maxLength={14}
              disabled={!isEdit}
              {...field}
            />
          )}
        />

        {/* Birthday */}
        <Controller
          name="birthday"
          control={control}
          render={({ field: { value, onChange, ...rest } }) => (
            <DateSelect
              title={t("form.birthday")}
              placeholder={tError("PLEASE_INPUT")}
              error={!!errors.birthday}
              errorMessage={errors.birthday?.message}
              sizeText="small"
              disabled={!isEdit}
              format={DAY_DMY}
              value={value ? dayjs(value) : null}
              onChange={(value) => onChange(value.toISOString())}
              {...rest}
            />
          )}
        />

        {/*  Ban */}
        {data && (
          <Controller
            name="banStatus"
            control={control}
            render={({ field }) => (
              <SelectFilter
                title={t("form.ban")}
                placeholder={tError("PLEASE_SELECT")}
                className="w-full"
                options={[
                  {
                    label: tFilter("status.ban"),
                    value: ENUM_ACCOUNT_STATUS.BANNED,
                  },
                  {
                    label: tFilter("status.unban"),
                    value: ENUM_ACCOUNT_STATUS.UNBAN,
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
                    label: tFilter("status.active"),
                    value: ENUM_ACCOUNT_STATUS.ACTIVE,
                  },
                  {
                    label: tFilter("status.inactive"),
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
