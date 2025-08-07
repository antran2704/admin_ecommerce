import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { Radio } from "antd";
import { ComponentProps } from "react";

import { ModalConfirm } from "~/components/Modal";
import { ICancelOrderForm } from "../interfaces";
import { initCancelFormData } from "../common";
import { cancelOrderFormSchema } from "../schemas/cancelForm.schema";
import FormField from "~/components/Core/Input/FormField";
import { ENUM_CANCELLATION_REASON } from "../enums";
import { InputTextArea } from "~/components/Core/Input";
import MESSAGE_ERROR from "~/common/errorMessage";

interface IProps {
  modalProps: Omit<ComponentProps<typeof ModalConfirm>, "title" | "onOk"> & {
    onOk?: (data: ICancelOrderForm) => void;
  };
}

export const CancelOrderModal = ({ modalProps }: IProps) => {
  const { t: tOrder } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  const {
    control,
    watch,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<ICancelOrderForm>({
    defaultValues: initCancelFormData,
    resolver: yupResolver(cancelOrderFormSchema(tError)) as any,
  });

  return (
    <ModalConfirm
      title={tOrder("modalCancel.title")}
      subtitle={tOrder("modalCancel.subtitle")}
      type="error"
      okText={tCommon("confirm")}
      cancelText={tCommon("goBack")}
      destroyOnClose={true}
      {...modalProps}
      onCancel={(e) => {
        modalProps.onCancel?.(e);
        reset(initCancelFormData);
      }}
      onOk={handleSubmit((values) => modalProps.onOk?.(values))}
    >
      <div className="flex flex-col py-2 gap-2">
        <Controller
          name="reason"
          control={control}
          render={({ field: { onChange } }) => (
            <FormField
              title={tOrder("cancellation.reason")}
              sizeText="small"
              required
              error={!!errors.reason}
              errorMessage={errors.reason?.message}
            >
              <Radio.Group
                disabled={!!modalProps?.okButtonProps.loading}
                onChange={(e) => {
                  onChange(e.target.value);
                  setValue("otherReason", "");
                }}
                options={[
                  {
                    value: ENUM_CANCELLATION_REASON.CUSTOMER_CHANGED_MIND,
                    label: tOrder("reason.customerChange"),
                  },
                  {
                    value: ENUM_CANCELLATION_REASON.OUT_OF_STOCK,
                    label: tOrder("reason.outOfStock"),
                  },
                  {
                    value: ENUM_CANCELLATION_REASON.OTHER,
                    label: tOrder("reason.other"),
                  },
                ]}
              ></Radio.Group>
            </FormField>
          )}
        />

        {watch("reason") === ENUM_CANCELLATION_REASON.OTHER && (
          <Controller
            name="otherReason"
            control={control}
            render={({ field }) => (
              <InputTextArea
                title={tOrder("cancellation.description")}
                placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                required={true}
                error={!!errors.otherReason}
                errorMessage={errors.otherReason?.message}
                sizeText="small"
                maxLength={300}
                showCount
                rows={3}
                {...field}
              />
            )}
          />
        )}
      </div>
    </ModalConfirm>
  );
};
