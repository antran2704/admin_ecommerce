import { TableColumnsType, message } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ModalConfirm } from "~/components/Modal";
import { TableCore } from "~/components/Core";

import { IPagination } from "~/interface/pagination";

import { initPagination } from "~/common/pagination";
import { BtnCheck, BtnEdit, BtnTrash } from "~/components/Button";
import { DAY_DMY } from "~/common/format";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { useAppSelector } from "~/store/hooks";
import MESSAGE_SUCCESS from "~/common/successMessage";
import { IVariantProductForm, IVariantProductTable } from "../interfaces";
import { NO_IMAGE } from "~/common/image";
import { formatBigNumber } from "~/helper/format";
import { ENUM_PRODUCT_STATUS } from "../../Product/enums";
import { getProductStatusTitle } from "../../Product/helpers/getStatusTitle";
import { apiVariantProductService } from "~/api-client/variantProduct";
import { variantProductFormSchema } from "../schemas/variantProductForm.schema";
import { InputTextArea } from "~/components/Core/Input";

interface Props {
  items: IVariantProductTable[];
  pagination?: IPagination;
  loading?: boolean;
  selectedRowKeys?: React.Key[];
  getData: () => void;
  onPagination: (nextPage: number, pageSize: number) => void;
  onSelectedRowKeys?: (selected: React.Key[]) => void;
  onSelectedRows?: (selectedRows: IVariantProductTable[]) => void;
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

  const { t, i18n } = useTranslation("VariantProductPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { infoUser } = useAppSelector((state) => state.user);

  const {
    control,
    formState: { errors },
    reset,
    getValues,
    handleSubmit,
  } = useForm<IVariantProductForm>({
    defaultValues: {},
    resolver: yupResolver(variantProductFormSchema(tError)) as any,
  });

  const [listItem, setListItem] = useState<IVariantProductTable[]>([]);
  const [selectItem, setSelectItem] = useState<IVariantProductTable | null>(
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
      await apiVariantProductService.delete(id);
      messageApi.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModalDelete();
      getData();
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    setLoadingDelete(false);
  };

  const onEdit = (record: IVariantProductTable) => {
    const newFormItem: IVariantProductForm = {
      [record.id]: {
        title: record.title,
        thumbnailUrl: record.thumbnail,
        basePrice: record.basePrice,
        promotionPrice: record.promotionPrice,
        stock: record.stock,
        isActive: record.status === ENUM_PRODUCT_STATUS.ACTIVE ? true : false,
      },
    };

    reset({ ...getValues(), ...newFormItem });
  };

  const onSave = (record: IVariantProductTable, value: IVariantProductForm) => {
    const dataForm = { ...value };

    reset({ ...dataForm, [record.id]: null });
  };

  // columnt table
  const columns: TableColumnsType<IVariantProductTable> =
    useMemo((): TableColumnsType<IVariantProductTable> => {
      return [
        {
          title: t("table.id"),
          dataIndex: "id",
          className: "cursor-pointer",
        },
        {
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          align: "center",
          className: "cursor-pointer",
          render: (value: string) => (
            <img
              src={value ? value : NO_IMAGE}
              className="w-20 min-w-20 rounded-md object-cover object-center mx-auto"
            />
          ),
        },
        {
          title: t("table.name"),
          dataIndex: "title",
          className: "cursor-pointer",
          render: (value: string, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.title`}
                  control={control}
                  render={({ field }) => (
                    <InputTextArea
                      placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                      required={true}
                      error={!!errors[record.id]?.title}
                      errorMessage={errors[record.id]?.title?.message}
                      sizeText="small"
                      showCount
                      rows={2}
                      className="w-[300px]"
                      {...field}
                    />
                  )}
                />
              );
            }

            return (
              <span className="block w-[200px]">
                {value ? value : tCommon("noData")}
              </span>
            );
          },
        },
        {
          title: t("table.basePrice"),
          dataIndex: "basePrice",
          align: "center",
          className: "cursor-pointer",
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.promotionPrice"),
          dataIndex: "promotionPrice",
          align: "center",
          className: "cursor-pointer",
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.stock"),
          dataIndex: "stock",
          align: "center",
          className: "cursor-pointer",
          render: (value: number) => (
            <span>{value ? formatBigNumber(value) : 0}</span>
          ),
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          align: "center",
          className: "cursor-pointer",
          render: (value: ENUM_PRODUCT_STATUS) => (
            <span>{getProductStatusTitle(t, value)}</span>
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
          render: (_, record: IVariantProductTable) => (
            <div className="flex items-center justify-center gap-2">
              {ability.can(EPermisisonAction.UPDATE, EPageRole.ADMIN_PRODUCT) &&
                !getValues(record.id) && (
                  <BtnEdit onClick={() => onEdit(record)} />
                )}

              {getValues(record.id) && (
                <BtnCheck
                  onClick={handleSubmit((value) => onSave(record, value))}
                />
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
    }, [i18n.resolvedLanguage, listItem, errors]);

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
        rowSelection={{
          selectedRowKeys,
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: IVariantProductTable[],
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
