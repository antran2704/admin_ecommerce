import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DefaultOptionType } from "antd/es/select";
import { useQueryClient } from "@tanstack/react-query";

import MESSAGE_ERROR from "~/common/errorMessage";
import { SelectFilter } from "~/components/Core";
import { ENUM_ORDER_STATUS } from "../enums";
import useModal from "~/hooks/useModal";
import { ModalConfirm } from "~/components/Modal";
import { useUpdateStatusOrder } from "../hooks";
import { ICancelOrderForm, IOrderResponse } from "../interfaces";
import { IUpdateOrderStatusRequest } from "../interfaces/updateStatusRequest.interface";
import { QUERY_KEY } from "~/constants/queryKey";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { CancelOrderModal } from "./CancelModal";

interface IProps {
  order: IOrderResponse;
  isEditable?: boolean;
}

export const OrderStatusDropdown = ({ order, isEditable }: IProps) => {
  const { t: tOrder } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { messageAntd } = useMessageAntd();

  const { orderStatus } = order || {};

  const { modal, onModal } = useModal({
    pending: false,
    cancel: false,
    process: false,
    complete: false,
  });

  const queryClient = useQueryClient();
  const { mutate: updateStatus, isPending } = useUpdateStatusOrder({
    onSuccess: (_, payload: IUpdateOrderStatusRequest) => {
      setCurrentStatus(payload.status);
      if (payload.status !== ENUM_ORDER_STATUS.CANCELLED) {
        queryClient.setQueryData([QUERY_KEY.ORDER, order.orderId], {
          ...order,
          orderStatus: payload.status,
        });
      }
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
    },
    onError: () => {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    },
  });

  const [currentStatus, setCurrentStatus] = useState<ENUM_ORDER_STATUS>(
    order?.orderStatus || ENUM_ORDER_STATUS.PENDING,
  );

  const options = useMemo((): DefaultOptionType[] => {
    if (orderStatus === ENUM_ORDER_STATUS.PENDING) {
      return [
        {
          label: tOrder("status.pending"),
          value: ENUM_ORDER_STATUS.PENDING,
          disabled: true,
        },
        {
          label: tOrder("action.process"),
          value: ENUM_ORDER_STATUS.PROCESSING,
        },
        {
          label: tOrder("action.cancel"),
          value: ENUM_ORDER_STATUS.CANCELLED,
        },
      ];
    }

    if (orderStatus === ENUM_ORDER_STATUS.PROCESSING) {
      return [
        {
          label: tOrder("status.processing"),
          value: ENUM_ORDER_STATUS.PROCESSING,
          disabled: true,
        },
        {
          label: tOrder("status.pending"),
          value: ENUM_ORDER_STATUS.PENDING,
        },
        {
          label: tOrder("action.complete"),
          value: ENUM_ORDER_STATUS.COMPLETED,
        },
        {
          label: tOrder("action.cancel"),
          value: ENUM_ORDER_STATUS.CANCELLED,
        },
      ];
    }

    return [];
  }, [order]);

  const onChangeStatus = (value: ENUM_ORDER_STATUS) => {
    if (value === ENUM_ORDER_STATUS.PENDING) {
      onModal({ pending: true });
    }

    if (value === ENUM_ORDER_STATUS.PROCESSING) {
      onModal({ process: true });
    }

    if (value === ENUM_ORDER_STATUS.COMPLETED) {
      onModal({ complete: true });
    }

    if (value === ENUM_ORDER_STATUS.CANCELLED) {
      onModal({ cancel: true });
    }
  };

  const handlePending = () => {
    const payload: IUpdateOrderStatusRequest = {
      orderId: order.orderId,
      status: ENUM_ORDER_STATUS.PENDING,
    };

    updateStatus(payload, {
      onSuccess: () => {
        onModal({ pending: false });
      },
    });
  };

  const handleProcess = () => {
    const payload: IUpdateOrderStatusRequest = {
      orderId: order.orderId,
      status: ENUM_ORDER_STATUS.PROCESSING,
    };

    updateStatus(payload, {
      onSuccess: () => {
        onModal({ process: false });
      },
    });
  };

  const handleComplete = () => {
    const payload: IUpdateOrderStatusRequest = {
      orderId: order.orderId,
      status: ENUM_ORDER_STATUS.CANCELLED,
    };

    updateStatus(payload, {
      onSuccess: () => {
        onModal({ process: false });
      },
    });
  };

  const handleCancel = (values: ICancelOrderForm) => {
    const payload: IUpdateOrderStatusRequest = {
      orderId: order.orderId,
      status: ENUM_ORDER_STATUS.CANCELLED,
      otherReason: values.otherReason,
      reason: values.reason,
    };

    updateStatus(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.ORDER, order.orderId],
        });
        onModal({ cancel: false });
      },
    });
  };

  return (
    <Fragment>
      <SelectFilter
        disabled={!isEditable}
        placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
        classNameWrap="lg:w-[200px] w-full"
        options={options}
        value={currentStatus}
        sizeText="small"
        showSearch={false}
        onChange={onChangeStatus}
      />

      <ModalConfirm
        title={tOrder("modalPending.title")}
        subtitle={tOrder("modalPending.subtitle")}
        open={modal.pending}
        type="danger"
        okButtonProps={{
          loading: isPending,
          disabled: isPending,
        }}
        onCancel={() => onModal({ pending: false })}
        onOk={handlePending}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      />

      <ModalConfirm
        title={tOrder("modalProcess.title")}
        subtitle={tOrder("modalProcess.subtitle")}
        open={modal.process}
        type="info"
        okButtonProps={{
          loading: isPending,
          disabled: isPending,
        }}
        onCancel={() => onModal({ process: false })}
        onOk={handleProcess}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      />

      <ModalConfirm
        title={tOrder("modalSuccess.title")}
        subtitle={tOrder("modalSuccess.subtitle")}
        open={modal.complete}
        type="info"
        okButtonProps={{
          loading: isPending,
          disabled: isPending,
        }}
        onCancel={() => onModal({ complete: false })}
        onOk={handleComplete}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      />

      <CancelOrderModal
        modalProps={{
          open: modal.cancel,
          okButtonProps: {
            loading: isPending,
            disabled: isPending,
          },
          onCancel: () => onModal({ cancel: false }),
          onOk: handleCancel,
        }}
      />
    </Fragment>
  );
};
