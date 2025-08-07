import { TableColumnsType } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { TableCore } from "~/components/Core";

import { IPagination } from "~/interface/pagination";

import { initPagination } from "~/common/pagination";
import { BtnEdit, BtnView } from "~/components/Button";
import { DAY_DMY } from "~/common/format";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import PATH_NAME from "~/routes/paths";
import { formatBigNumber } from "~/helper/format";
import { IOrderTable } from "../interfaces/orderTable.interface";
import { ENUM_ORDER_STATUS } from "../enums";
import { OrderStatus } from "./Status";
import { VND_CURRENCY } from "~/common/currency";
import { ENUM_TRANSACTION_STATUS } from "~/enum/transaction";
import { OrderTransactionStatus } from "./TransactionStatus";

interface Props {
  items: IOrderTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  onPagination: (nextPage: number, pageSize: number) => void;
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: IOrderTable[]) => void;
}

const Table = (props: Props) => {
  const {
    items,
    pagination = initPagination,
    loading = false,
    selectedRowKeys,
    onPagination,
    onSelectedRowKeys,
    onSelectedRows,
  } = props;

  const { t, i18n } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");

  const navigate = useNavigate();

  const [listItem, setListItem] = useState<IOrderTable[]>([]);

  // columnt table
  const columns: TableColumnsType<IOrderTable> =
    useMemo((): TableColumnsType<IOrderTable> => {
      return [
        {
          title: t("table.id"),
          dataIndex: "id",
          className: "cursor-pointer",
        },
        {
          title: t("table.name"),
          dataIndex: "customerName",
          render: (value: string) => (
            <span>{value ? value : tCommon("noData")}</span>
          ),
        },
        {
          title: t("table.phoneNumber"),
          dataIndex: "phoneNumber",
          className: "cursor-pointer",
          render: (value: string) => (
            <Link to={`tel:${value}`} className="hover:text-primary-color">
              {value ? `+${value}` : tCommon("noData")}
            </Link>
          ),
        },
        {
          title: t("table.totalPrice"),
          dataIndex: "totalPrice",
          align: "center",
          render: (value: number) => (
            <span>
              {value ? formatBigNumber(value) : 0} {VND_CURRENCY}
            </span>
          ),
        },
        {
          title: t("table.transaction"),
          dataIndex: "transactionStatus",
          align: "center",
          className: "cursor-pointer",
          render: (value: ENUM_TRANSACTION_STATUS) => (
            <OrderTransactionStatus status={value} />
          ),
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          align: "center",
          className: "cursor-pointer",
          render: (value: ENUM_ORDER_STATUS) => <OrderStatus status={value} />,
        },
        {
          title: t("table.createdAt"),
          dataIndex: "createdAt",
          align: "center",
          render: (value: string) => (
            <span className="whitespace-nowrap">
              {value ? dayjs(value).format(DAY_DMY) : tCommon("noData")}
            </span>
          ),
        },
        {
          title: tCommon("action"),
          width: 200,
          fixed: "right",
          render: (_, record: IOrderTable) => (
            <div className="flex items-center justify-center gap-2">
              <Link to={PATH_NAME.UPDATE_ORDER(record.id)}>
                <BtnView />
              </Link>

              {ability.can(
                EPermisisonAction.UPDATE,
                EPageRole.ADMIN_PRODUCT,
              ) && (
                <Link to={PATH_NAME.UPDATE_ORDER(record.id) + "?edit=1"}>
                  <BtnEdit />
                </Link>
              )}
            </div>
          ),
          align: "center",
        },
      ];
    }, [i18n.resolvedLanguage, listItem]);

  useEffect(() => {
    setListItem(items);
  }, [items]);

  return (
    <div className="scrollHidden bg-white overflow-x-auto">
      <TableCore
        rowKey={"id"}
        columns={columns}
        dataSource={listItem}
        loading={loading}
        paginationOptions={{
          pageSize: pagination.take,
          current: pagination.page,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (nextPage, newPageSize) => {
            onPagination(nextPage, newPageSize);
          },
          locale: {
            items_per_page: `/ ${tCommon("pagination.page") as string}`,
          },
        }}
        onRow={(record: IOrderTable) => {
          return {
            onDoubleClick: () => {
              navigate(PATH_NAME.UPDATE_ORDER(record.id));
            },
          };
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: IOrderTable[],
          ) => {
            onSelectedRowKeys(selectedRowKeys);
            onSelectedRows(selectedRows);
          },
          preserveSelectedRowKeys: true,
          columnWidth: 100,
        }}
      />
    </div>
  );
};

export default memo(Table);
