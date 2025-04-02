import { TableColumnsType, message } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { ModalConfirm } from "~/components/Modal";
import { TableCore } from "~/components/Core";

import { IPagination } from "~/interface/pagination";

import { initPagination } from "~/common/pagination";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { BtnEdit, BtnTrash, BtnView } from "~/components/Button";
import { DAY_DMY } from "~/common/format";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import Status from "~/components/Status";
import { useAppSelector } from "~/store/hooks";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { IUserTable } from "../interfaces";
import { apiUserService } from "~/api-client/user";
import { ENUM_USER_PROVIDER } from "../enums";
import getLabelForProvider from "../helpers/getLabelForProvider.helper";
import PATH_NAME from "~/routes/paths";

interface Props {
  items: IUserTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  getData: () => void;
  onPagination: (nextPage: number, pageSize: number) => void;
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: IUserTable[]) => void;
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

  const { t, i18n } = useTranslation("UserPage");
  const { t: tFilter } = useTranslation("Filter");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const { infoUser } = useAppSelector((state) => state.user);

  const [listItem, setListItem] = useState<IUserTable[]>([]);
  const [selectItem, setSelectItem] = useState<IUserTable | null>(null);

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const onModalDelete = () => {
    if (isOpenDelete) {
      setSelectItem(null);
    }

    setIsOpenDelete(!isOpenDelete);
  };

  const handleDelete = async (id: string) => {
    setLoadingDelete(true);

    try {
      await apiUserService.delete(id);
      messageApi.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModalDelete();
      getData();
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    setLoadingDelete(false);
  };

  // columnt table
  const columns: TableColumnsType<IUserTable> =
    useMemo((): TableColumnsType<IUserTable> => {
      return [
        {
          title: t("table.id"),
          dataIndex: "id",
          className: "cursor-pointer",
        },
        {
          title: t("table.name"),
          dataIndex: "name",
          className: "cursor-pointer",
          render: (name: string) => (
            <span>{name ? name : tCommon("noData")}</span>
          ),
        },
        {
          title: t("table.email"),
          dataIndex: "email",
          className: "cursor-pointer",
          render: (value: string) => (
            <span>{value ? value : tCommon("noData")}</span>
          ),
        },
        {
          title: t("table.phone"),
          dataIndex: "phoneNumber",
          className: "cursor-pointer",
          render: (value: string) => (
            <span>{value ? value : tCommon("noData")}</span>
          ),
        },
        {
          title: t("table.provider"),
          dataIndex: "providers",
          className: "cursor-pointer",
          align: "center",
          render: (value: ENUM_USER_PROVIDER[]) => (
            <span>
              {value.length
                ? value.map((x) => getLabelForProvider(t, x)).join(", ")
                : tCommon("noData")}
            </span>
          ),
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          align: "center",
          render: (value: ENUM_ACCOUNT_STATUS) => (
            <Status
              label={
                value === ENUM_ACCOUNT_STATUS.ACTIVE
                  ? tFilter("status.active")
                  : tFilter("status.inactive")
              }
              classNames={{
                dot:
                  value === ENUM_ACCOUNT_STATUS.ACTIVE
                    ? "bg-blue-500"
                    : "bg-gray-500",
              }}
            />
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
          render: (_, record: IUserTable) => (
            <div className="flex items-center justify-center gap-2">
              <Link to={PATH_NAME.UPDATE_USER(record.id)}>
                <BtnView />
              </Link>

              {ability.can(EPermisisonAction.UPDATE, EPageRole.ADMIN_USER) && (
                <Link to={PATH_NAME.UPDATE_USER(record.id) + "?edit=1"}>
                  <BtnEdit />
                </Link>
              )}

              {ability.can(EPermisisonAction.DELETE, EPageRole.ADMIN_USER) &&
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
        onRow={(record: IUserTable) => {
          return {
            onDoubleClick: () => {
              navigate(PATH_NAME.UPDATE_USER(record.id));
            },
          };
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: IUserTable[],
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

      {/* message Antd */}
      {contextHolder}
    </div>
  );
};

export default memo(Table);
