import { useTranslation } from "react-i18next";
import { Tag, TagProps } from "antd";
import { ENUM_TRANSACTION_STATUS } from "~/enum/transaction";
import MESSAGE_ERROR from "~/common/errorMessage";

interface IProps {
  status: ENUM_TRANSACTION_STATUS;
  tagProps?: TagProps;
}

export const OrderTransactionStatus = ({ status, tagProps }: IProps) => {
  const { t } = useTranslation("Transaction");
  const { t: tError } = useTranslation("Error");

  const commonProps: TagProps = {
    ...tagProps,
  };

  switch (status) {
    case ENUM_TRANSACTION_STATUS.PENDING:
      return (
        <Tag {...commonProps} color="yellow">
          {t("status.pending")}
        </Tag>
      );

    case ENUM_TRANSACTION_STATUS.SUCCESS:
      return (
        <Tag {...commonProps} color="green">
          {t("status.success")}
        </Tag>
      );

    case ENUM_TRANSACTION_STATUS.FAILED:
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
