import { TableColumnsType } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { ModalConfirm } from "~/components/Modal";
import { TableCore } from "~/components/Core";

import { IPagination } from "~/interface/pagination";

import { initPagination } from "~/common/pagination";
import { BtnEdit, BtnTrash, BtnView } from "~/components/Button";
import { DAY_DMY } from "~/common/format";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { useAppSelector } from "~/store/hooks";
import MESSAGE_SUCCESS from "~/common/successMessage";
import PATH_NAME from "~/routes/paths";
import { apiProductService } from "~/api-client/product";
import { formatBigNumber } from "~/helper/format";
import useMessageAntd from "~/hooks/useMessageAntd";
import { IOrderTable } from "../interfaces/orderTable.interface";
import { ENUM_ORDER_STATUS } from "../enums";
import { getOrderStatusTitle } from "../helpers/getStatusTitle";

interface Props {
  items: IOrderTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  getData: () => void;
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
    getData,
    onPagination,
    onSelectedRowKeys,
    onSelectedRows,
  } = props;

  const { t, i18n } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const { infoUser } = useAppSelector((state) => state.user);

  const [listItem, setListItem] = useState<IOrderTable[]>([]);
  const [selectItem, setSelectItem] = useState<IOrderTable | null>(null);

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const { messageAntd } = useMessageAntd();

  const onModalDelete = () => {
    if (isOpenDelete) {
      setSelectItem(null);
    }

    setIsOpenDelete(!isOpenDelete);
  };

  const handleDelete = async (id: string) => {
    setLoadingDelete(true);

    try {
      await apiProductService.delete(id);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModalDelete();
      getData();
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    setLoadingDelete(false);
  };

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
            <span className="block w-[200px]">
              {value ? value : tCommon("noData")}
            </span>
          ),
        },
        {
          title: t("table.phoneNumber"),
          dataIndex: "phoneNumber",
          className: "cursor-pointer",
          render: (value: string) => (
            <span className="block w-[200px]">
              {value ? value : tCommon("noData")}
            </span>
          ),
        },
        {
          title: t("table.totalPrice"),
          dataIndex: "totalPrice",
          align: "center",
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          align: "center",
          className: "cursor-pointer",
          render: (value: ENUM_ORDER_STATUS) => (
            <span>{getOrderStatusTitle(t, value)}</span>
          ),
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
              <Link to={PATH_NAME.UPDATE_PRODUCT(record.id)}>
                <BtnView />
              </Link>

              {ability.can(
                EPermisisonAction.UPDATE,
                EPageRole.ADMIN_PRODUCT,
              ) && (
                <Link to={PATH_NAME.UPDATE_PRODUCT(record.id) + "?edit=1"}>
                  <BtnEdit />
                </Link>
              )}

              {ability.can(EPermisisonAction.DELETE, EPageRole.ADMIN_PRODUCT) &&
                infoUser.userId !== record.id && (
                  <BtnTrash
                    onClick={() => {
                      setSelectItem(record);
                      onModalDelete();
                    }}
                  />
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
              navigate(PATH_NAME.UPDATE_PRODUCT(record.id));
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

      {/* Modal Delete Project */}
      <ModalConfirm
        title={t("modalDelete.title")}
        subtitle={t("modalDelete.subtitle")}
        open={isOpenDelete}
        type="error"
        okButtonProps={{
          loading: loadingDelete,
          disabled: loadingDelete,
        }}
        onCancel={onModalDelete}
        onOk={() => handleDelete(selectItem.id as string)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      />
    </div>
  );
};

export default memo(Table);
