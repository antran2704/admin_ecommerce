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
import { ICategoryTable } from "../interfaces";
import { apiCategoryService } from "~/api-client/category";
import { NO_IMAGE } from "~/common/image";
import { formatBigNumber } from "~/helper/format";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  items: ICategoryTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  getData: () => void;
  onPagination: (nextPage: number, pageSize: number) => void;
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: ICategoryTable[]) => void;
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

  const { t, i18n } = useTranslation("CategoryPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const navigate = useNavigate();

  const { infoUser } = useAppSelector((state) => state.user);
  const { messageAntd } = useMessageAntd();

  const [listItem, setListItem] = useState<ICategoryTable[]>([]);
  const [selectItem, setSelectItem] = useState<ICategoryTable | null>(null);

  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onModalDelete = () => {
    if (isOpenDelete) {
      setSelectItem(null);
    }

    setIsOpenDelete(!isOpenDelete);
  };

  const handleDelete = async (id: string) => {
    setLoadingDelete(true);

    try {
      await apiCategoryService.delete(id);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModalDelete();
      getData();
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    setLoadingDelete(false);
  };

  // columnt table
  const columns: TableColumnsType<ICategoryTable> =
    useMemo((): TableColumnsType<ICategoryTable> => {
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
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          align: "center",
          className: "cursor-pointer",
          render: (value: string) => (
            <img
              src={value ? value : NO_IMAGE}
              className="w-16 min-w-16 rounded-md object-cover object-center mx-auto"
            />
          ),
        },
        {
          title: t("table.child"),
          dataIndex: "childCount",
          align: "center",
          className: "cursor-pointer",
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
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
          render: (_, record: ICategoryTable) => (
            <div className="flex items-center justify-center gap-2">
              <Link to={PATH_NAME.UPDATE_CATEGORY(record.id)}>
                <BtnView />
              </Link>

              {ability.can(
                EPermisisonAction.UPDATE,
                EPageRole.ADMIN_CATEGORY,
              ) && (
                <Link to={PATH_NAME.UPDATE_CATEGORY(record.id) + "?edit=1"}>
                  <BtnEdit />
                </Link>
              )}

              {ability.can(
                EPermisisonAction.DELETE,
                EPageRole.ADMIN_CATEGORY,
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
        onRow={(record: ICategoryTable) => {
          return {
            onDoubleClick: () => {
              navigate(PATH_NAME.UPDATE_CATEGORY(record.id));
            },
          };
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: ICategoryTable[],
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
