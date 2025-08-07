import { useTranslation } from "react-i18next";
import { ENUM_ORDER_STATUS } from "../enums";
import { Tag, TagProps } from "antd";
import MESSAGE_ERROR from "~/common/errorMessage";

interface IProps {
  status: ENUM_ORDER_STATUS;
  tagProps?: TagProps;
}

export const OrderStatus = ({ status, tagProps }: IProps) => {
  const { t } = useTranslation("OrderPage");
  const { t: tError } = useTranslation("Error");

  const commonProps: TagProps = {
    ...tagProps,
  };

  switch (status) {
    case ENUM_ORDER_STATUS.PENDING:
      return (
        <Tag {...commonProps} color="yellow">
          {t("status.pending")}
        </Tag>
      );

    case ENUM_ORDER_STATUS.PROCESSING:
      return (
        <Tag {...commonProps} color="blue">
          {t("status.processing")}
        </Tag>
      );

    case ENUM_ORDER_STATUS.COMPLETED:
      return (
        <Tag {...commonProps} color="green">
          {t("status.completed")}
        </Tag>
      );

    case ENUM_ORDER_STATUS.CANCELLED:
      return (
        <Tag {...commonProps} color="red">
          {t("status.cancelled")}
        </Tag>
      );

    default:
      return (
        <Tag {...commonProps} color="default">
          {tError(MESSAGE_ERROR.NO_DATA)}
        </Tag>
      );
  }
};
