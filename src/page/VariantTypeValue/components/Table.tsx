import { TableColumnsType, message } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
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
import { IVariantTypeValueTable } from "../interfaces";
import { apiVariantTypeValueService } from "~/api-client/variantTypeValue";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

interface Props {
  items: IVariantTypeValueTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  getData: () => void;
  onPagination: (nextPage: number, pageSize: number) => void;
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: IVariantTypeValueTable[]) => void;
  onSelectItem: (item: IVariantTypeValueTable) => void;
  onEdit: (value: boolean) => void;
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
    onSelectItem,
    onEdit,
  } = props;

  const { t, i18n } = useTranslation("VariantTypeValuePage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { infoUser } = useAppSelector((state) => state.user);

  const [listItem, setListItem] = useState<IVariantTypeValueTable[]>([]);
  const [selectItem, setSelectItem] = useState<IVariantTypeValueTable | null>(
    null,
  );

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
      await apiVariantTypeValueService.delete(id);
      messageApi.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModalDelete();
      getData();
    } catch (error) {
      const { message } = hanldeErrorAxios(error);

      if (message === "VARIANT_VALUE_IS_USED") {
        messageApi.error(t("error.VARIANT_VALUE_IS_USED"));
      } else {
        messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    setLoadingDelete(false);
  };

  // columnt table
  const columns: TableColumnsType<IVariantTypeValueTable> =
    useMemo((): TableColumnsType<IVariantTypeValueTable> => {
      return [
        {
          title: t("table.id"),
          dataIndex: "id",
          className: "cursor-pointer",
        },
        {
          title: t("table.name"),
          dataIndex: "title",
          className: "cursor-pointer",
          render: (value: string) => (
            <span>{value ? value : tCommon("noData")}</span>
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
          render: (_, record: IVariantTypeValueTable) => (
            <div className="flex items-center justify-center gap-2">
              <BtnView onClick={() => onSelectItem(record)} />

              {ability.can(
                EPermisisonAction.UPDATE,
                EPageRole.ADMIN_VARIANT_TYPE_VALUE,
              ) && (
                <BtnEdit
                  onClick={() => {
                    onSelectItem(record);
                    onEdit(true);
                  }}
                />
              )}

              {ability.can(
                EPermisisonAction.DELETE,
                EPageRole.ADMIN_VARIANT_TYPE,
              ) &&
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
        onRow={(record: IVariantTypeValueTable) => {
          return {
            onDoubleClick: () => {
              onSelectItem(record);
            },
          };
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: IVariantTypeValueTable[],
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
