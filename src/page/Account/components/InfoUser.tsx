import dayjs from "dayjs";
import { Controller, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DAY_DMY } from "~/common/format";
import { InputText } from "~/components/Core/Input";
import { DateFilter, SelectFilter } from "~/components/Core";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IProfileForm } from "../interfaces";

interface Props {
  isEdit: boolean;
  form: UseFormReturn<IProfileForm, any, undefined>;
}

const InforUser = (props: Props) => {
  const { form, isEdit } = props;

  const {
    control,
    formState: { errors },
  } = form;

  const { t } = useTranslation("AccountPage");
  const { t: tError } = useTranslation("Error");

  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-2 gap-14">
        {/* first column */}
        <div className="flex flex-col gap-4">
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
                disabled
                error={!!errors.email}
                errorMessage={errors.email?.message}
                sizeText="small"
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
            render={({ field }) => (
              <InputText
                title={t("form.roleGroup")}
                placeholder={tError("PLEASE_INPUT")}
                required={true}
                disabled
                error={!!errors.groupRole}
                errorMessage={errors.groupRole?.message}
                sizeText="small"
                {...field}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <InputText
                title={t("form.role")}
                placeholder={tError("PLEASE_INPUT")}
                required={true}
                disabled
                error={!!errors.role}
                errorMessage={errors.role?.message}
                sizeText="small"
                {...field}
              />
            )}
          />
        </div>

        {/* third column */}
        <div className="flex flex-col gap-4">
          {/*  Status */}
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
                  disabled
                  {...field}
                />
              )}
            />
          </div>

          {/* Created at */}
          <div className="flex flex-col">
            <Controller
              name="createdAt"
              control={control}
              render={({ field: { value, onChange, ...rest } }) => (
                <DateFilter
                  title={t("form.createdAt")}
                  placeholder={tError("PLEASE_SELECT")}
                  error={!!errors.createdAt}
                  errorMessage={errors.createdAt?.message}
                  sizeText="small"
                  format={DAY_DMY}
                  value={value ? dayjs(value) : null}
                  allowClear={false}
                  disabled
                  onChange={(date) => onChange(date.format(DAY_DMY))}
                  {...rest}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InforUser;
