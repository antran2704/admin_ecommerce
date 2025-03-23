import { useEffect, useMemo, useState } from "react";
import { Button, message } from "antd";
import dayjs from "dayjs";
import { object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { DAY_DMY } from "~/common/format";
import { IProfileForm, IUpdateProfileMe } from "~/interface/profile";
import { InputPhone, InputText } from "~/components/Core/Input";
import { DateFilter, SelectFilter } from "~/components/Core";
import { ENUM_ACCOUNT_STATUS, ENUM_GENDER } from "~/enum/user";
import { fetchUserAsyncThunk } from "~/store/slice/user";
import {
  combinePhoneNumber,
  getPhoneNumberAndCodeArea,
} from "~/helper/phoneNumber";

const initData: IProfileForm = {
  fullName: "Antran baby",
  dateOfBirth: "",
  email: "antransuper@gmail.com",
  phoneNumber: "0946003xxx",
  codeArea: "84",
  role: [],
  address: "hỏng có nhớ",
  gender: ENUM_GENDER.MALE,
  createdAt: dayjs(new Date()).format(DAY_DMY),
  startedAt: dayjs(new Date()).format(DAY_DMY),
  endedAt: "",
  roleGroup: [],
  status: ENUM_ACCOUNT_STATUS.ACTIVE,
  workLocationAddress: "253 HVT",
  workLocationId: "1",
};

interface Props {
  isEdit: boolean;
  onEdit?: () => void;
}

const InforUser = (props: Props) => {
  const { isEdit, onEdit } = props;

  const { t, i18n } = useTranslation("AccountPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  // validation project form
  const schema = useMemo(() => {
    return object().shape({
      fullName: string().required(tError("PLEASE_INPUT")),
      email: string().required(tError("PLEASE_INPUT")),
      dateOfBirth: string().trim().required(tError("PLEASE_SELECT")),
      phoneNumber: string().test(
        "check-phoneNumber",
        tError("INVALID_PHONE"),
        (value) => {
          return !value.trim() || value.trim().length >= 9;
        },
      ),
    });
  }, [i18n.resolvedLanguage]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<IProfileForm>({
    defaultValues: initData,
    resolver: yupResolver(schema) as any,
  });

  const [loading, setLoading] = useState<{ submit: boolean }>({
    submit: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onLoading = (key: keyof typeof loading, status: boolean) => {
    setLoading({ ...loading, [key]: status });
  };

  const onSubmit = async (values: IProfileForm) => {
    onLoading("submit", true);

    const phoneNumber = values.phoneNumber
      ? combinePhoneNumber(values.codeArea, values.phoneNumber)
      : "";

    const dataSend: IUpdateProfileMe = {
      fullName: values.fullName,
      dateOfBirth: dayjs(values.dateOfBirth, DAY_DMY).toISOString(),
      gender: values.gender,
      phoneNumber,
      address: values.address,
    };

    // await updateMe(dataSend)
    //   .then(() => {
    //     dispatch(fetchUserAsyncThunk());
    //     messageApi.success(tSuccess("ok"));
    //   })
    //   .catch(() => {
    //     messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    //   });

    onLoading("submit", false);
  };

  const handleGetData = async () => {
    // const { codeArea, phone } = getPhoneNumberAndCodeArea(infoUser.phoneNumber);

    // reset({
    //   address: infoUser.address,
    //   dateOfBirth: infoUser.dateOfBirth
    //     ? dayjs(infoUser.dateOfBirth).format(DAY_DMY)
    //     : null,
    //   email: infoUser.email,
    //   fullName: infoUser.fullName,
    //   phoneNumber: phone,
    //   codeArea: codeArea || "84",
    //   status: infoUser.isActive
    //     ? ENUM_ACCOUNT_STATUS.ACTIVE
    //     : ENUM_ACCOUNT_STATUS.INACTIVE,
    //   createdAt: dayjs(infoUser.createdAt).format(DAY_DMY),
    //   gender: infoUser.gender ? infoUser.gender : ENUM_GENDER.MALE,
    //   role: infoUser.roleNames,
    //   roleGroup: infoUser.groups,
    //   startedAt: dayjs(infoUser.createdAt).format(DAY_DMY),
    //   endedAt: "",
    //   workLocationAddress: infoUser.workLocationAddress,
    //   workLocationId: infoUser.workLocationId,
    // });
  };

  useEffect(() => {
    if (infoUser.userId) {
      handleGetData();
    }
  }, [infoUser]);

  return (
    <div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 py-2 gap-14">
        {/* first column */}
        <div className="flex flex-col gap-4">
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
                  disabled
                  error={!!errors.email}
                  errorMessage={errors.email?.message}
                  sizeText="small"
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
                  disabled={!isEdit}
                  codeArea={watch("codeArea")}
                  onChangeCodeArea={(value) => setValue("codeArea", value)}
                  {...field}
                />
              )}
            />
          </div>

          {/* Work place */}
          <div className="flex flex-col">
            <Controller
              name="workLocationAddress"
              control={control}
              render={({ field }) => (
                <InputText
                  title={t("form.workplace")}
                  placeholder={tCommon("noData")}
                  error={!!errors.workLocationAddress}
                  errorMessage={errors.workLocationAddress?.message}
                  sizeText="small"
                  disabled
                  required
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
                  title={t("form.birthday")}
                  placeholder={tError("PLEASE_SELECT")}
                  error={!!errors.dateOfBirth}
                  errorMessage={errors.dateOfBirth?.message}
                  sizeText="small"
                  format={DAY_DMY}
                  value={value ? dayjs(value, DAY_DMY) : null}
                  disabled={!isEdit}
                  onChange={(date) => onChange(date.format(DAY_DMY))}
                  {...rest}
                />
              )}
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <SelectFilter
                  title={t("form.sex")}
                  placeholder={tError("PLEASE_SELECT")}
                  className="w-full"
                  options={[
                    { label: t("filter.male"), value: ENUM_GENDER.MALE },
                    { label: t("filter.female"), value: ENUM_GENDER.FEMALE },
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
              name="roleGroup"
              control={control}
              render={({ field }) => (
                <SelectFilter
                  title={t("form.roleGroup")}
                  placeholder={tCommon("noData")}
                  className="w-full"
                  error={!!errors.roleGroup}
                  errorMessage={errors.roleGroup?.message}
                  sizeText="small"
                  required={true}
                  disabled
                  {...field}
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
              name="role"
              control={control}
              render={({ field }) => (
                <SelectFilter
                  title={t("form.role")}
                  placeholder={tCommon("noData")}
                  className="w-full pointer-events-none"
                  error={!!errors.role}
                  errorMessage={errors.role?.message}
                  sizeText="small"
                  required={true}
                  disabled
                  {...field}
                />
              )}
            />
          </div>

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

          {/* Start - End date */}
          <div className="grid xl:grid-cols-2 grid-cols-1 gap-2">
            {/* Started at */}
            <div className="flex flex-col">
              <Controller
                name="startedAt"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <DateFilter
                    title={t("form.startedAt")}
                    placeholder={tError("PLEASE_SELECT")}
                    error={!!errors.startedAt}
                    errorMessage={errors.startedAt?.message}
                    sizeText="small"
                    format={DAY_DMY}
                    value={value ? dayjs(value, DAY_DMY) : null}
                    onChange={(date) => onChange(date.format(DAY_DMY))}
                    allowClear={false}
                    disabled
                    {...rest}
                  />
                )}
              />
            </div>

            {/* Ended at */}
            <div className="flex flex-col">
              <Controller
                name="endedAt"
                control={control}
                render={({ field: { value, onChange, ...rest } }) => (
                  <DateFilter
                    title={t("form.endedAt")}
                    placeholder={tError("PLEASE_SELECT")}
                    error={!!errors.endedAt}
                    errorMessage={errors.endedAt?.message}
                    sizeText="small"
                    format={DAY_DMY}
                    value={value ? dayjs(value, DAY_DMY) : null}
                    onChange={(date) => onChange(date.format(DAY_DMY))}
                    allowClear={false}
                    disabled
                    {...rest}
                  />
                )}
              />
            </div>
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
                  value={value ? dayjs(value, DAY_DMY) : null}
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

      {isEdit && (
        <div className="flex items-center justify-end pt-5 gap-5">
          <Button
            size="large"
            type={"default"}
            onClick={onEdit}
            className="w-[170px]"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit(onSubmit)}
            loading={loading.submit}
            disabled={loading.submit}
            className="w-[170px]"
          >
            {tCommon("save")}
          </Button>
        </div>
      )}

      {!isEdit && (
        <div className="flex items-center justify-end pt-5 gap-5">
          <Button size="large" type={"default"} href="/" className="w-[170px]">
            {tCommon("goBack")}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={onEdit}
            className="w-[170px]"
          >
            {tCommon("update")}
          </Button>
        </div>
      )}

      {/* message Antd */}
      {contextHolder}
    </div>
  );
};

export default InforUser;
