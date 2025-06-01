import { Switch, TableColumnsType, Tag } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";

import { ModalConfirm } from "~/components/Modal";
import { TableCore } from "~/components/Core";

import { IPagination } from "~/interface/pagination";

import { initPagination } from "~/common/pagination";
import { BtnCheck, BtnClose, BtnEdit, BtnTrash } from "~/components/Button";
import { DAY_DMY } from "~/common/format";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { useAppSelector } from "~/store/hooks";
import MESSAGE_SUCCESS from "~/common/successMessage";
import {
  IUpdateVariantProductRequest,
  IVariantProductForm,
  IVariantProductTable,
} from "../interfaces";
import { NO_IMAGE } from "~/common/image";
import { formatBigNumber } from "~/helper/format";
import { ENUM_PRODUCT_STATUS } from "../../Product/enums";
import { getProductStatusTitle } from "../../Product/helpers/getStatusTitle";
import { apiVariantProductService } from "~/api-client/variantProduct";
import { variantProductFormSchema } from "../schemas/variantProductForm.schema";
import { InputNumber, InputTextArea } from "~/components/Core/Input";
import useMessageAntd from "~/hooks/useMessageAntd";
import useLoading from "~/hooks/useLoading";
import useModal from "~/hooks/useModal";
import { useProductContext } from "~/page/Product/hooks";

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
    loading: loadingProp = false,
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

  const { product } = useProductContext();

  const { messageAntd } = useMessageAntd();

  const {
    control,
    formState: { errors, dirtyFields },
    reset,
    getValues,
    setValue,
    handleSubmit,
  } = useForm<IVariantProductForm>({
    defaultValues: {},
    resolver: yupResolver(variantProductFormSchema(tError)) as any,
  });

  const [listItem, setListItem] = useState<IVariantProductTable[]>([]);
  const [selectItem, setSelectItem] = useState<IVariantProductTable | null>(
    null,
  );

  const { loading, onLoading } = useLoading({ delete: false });

  const { modal, onModal } = useModal({ delete: false, selectImage: false });

  const handleDelete = async (id: string) => {
    onLoading({ delete: true });

    try {
      await apiVariantProductService.delete(id);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.DELETED));
      onModal({ delete: false });
      setSelectItem(null);
      getData();
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    onLoading({ delete: false });
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

    reset(
      { ...getValues(), ...newFormItem },
      {
        keepDirty: true,
      },
    );
  };

  const onCancelEdit = (record: IVariantProductTable) => {
    setValue(record.id, null, { shouldDirty: false });
  };

  const onSelectImage = (value: string) => {
    const newFormData = { ...getValues(selectItem.id), thumbnailUrl: value };

    setValue(selectItem.id, newFormData, { shouldDirty: true });
    setSelectItem(null);
    onModal({ selectImage: false });
  };

  const resetRowTable = (
    record: IVariantProductTable,
    value: IVariantProductForm,
  ) => {
    const index = listItem.findIndex((item) => item.id === record.id);
    const newListItem = [...listItem];
    newListItem[index] = {
      ...newListItem[index],
      title: value[record.id].title,
      thumbnail: value[record.id].thumbnailUrl,
      basePrice: value[record.id].basePrice,
      promotionPrice: value[record.id].promotionPrice,
      stock: value[record.id].stock,
      status: value[record.id].isActive
        ? ENUM_PRODUCT_STATUS.ACTIVE
        : ENUM_PRODUCT_STATUS.INACTIVE,
    };

    setListItem(newListItem);
  };

  const onSave = async (
    record: IVariantProductTable,
    value: IVariantProductForm,
  ) => {
    const dataForm = { ...value };

    // Dont call API if haven't any change
    if (!dirtyFields[record.id]) {
      setValue(record.id, null, { shouldDirty: false });
      return;
    }

    const dataFormItem = dataForm[record.id];
    const dataSend: IUpdateVariantProductRequest = {
      variantProductName: dataFormItem.title,
      thumbnail: dataFormItem.thumbnailUrl,
      basePrice: dataFormItem.basePrice,
      promotionPrice: dataFormItem.promotionPrice,
      stock: dataFormItem.stock,
    };

    try {
      await apiVariantProductService.update(record.id, dataSend);

      if (
        dataFormItem.isActive &&
        record.status === ENUM_PRODUCT_STATUS.INACTIVE
      ) {
        await apiVariantProductService.enable(record.id);
      }

      if (
        !dataFormItem.isActive &&
        record.status === ENUM_PRODUCT_STATUS.ACTIVE
      ) {
        await apiVariantProductService.disable(record.id);
      }

      resetRowTable(record, dataForm);
      messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      setValue(record.id, null, { shouldDirty: false });
    } catch (error) {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  };

  const getStatusEl = (value: ENUM_PRODUCT_STATUS) => {
    if (value === ENUM_PRODUCT_STATUS.ACTIVE) {
      return <Tag color="success">{getProductStatusTitle(t, value)}</Tag>;
    }

    if (value === ENUM_PRODUCT_STATUS.INACTIVE) {
      return <Tag color="error">{getProductStatusTitle(t, value)}</Tag>;
    }
  };

  // columnt table
  const columns: TableColumnsType<IVariantProductTable> =
    useMemo((): TableColumnsType<IVariantProductTable> => {
      return [
        {
          title: t("table.id"),
          dataIndex: "id",
        },
        {
          title: t("table.thumbnail"),
          dataIndex: "thumbnail",
          align: "center",
          render: (value: string, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.thumbnailUrl`}
                  control={control}
                  render={({ field: { value: valueForm } }) => (
                    <img
                      src={valueForm ? valueForm : NO_IMAGE}
                      onClick={() => {
                        setSelectItem(record);
                        onModal({ selectImage: true });
                      }}
                      className={clsx(
                        "w-20 min-w-20 rounded-md object-cover object-center mx-auto cursor-pointer",
                      )}
                    />
                  )}
                />
              );
            }

            return (
              <img
                src={value ? value : NO_IMAGE}
                className={clsx(
                  "w-20 min-w-20 rounded-md object-cover object-center mx-auto",
                )}
              />
            );
          },
        },
        {
          title: t("table.name"),
          dataIndex: "title",
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
          render: (value: number, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.basePrice`}
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <InputNumber
                      className="w-[200px]"
                      placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                      value={!!value ? formatBigNumber(value) : 0}
                      maximum={999999999}
                      error={!!errors[record.id]?.basePrice}
                      errorMessage={errors[record.id]?.basePrice?.message}
                      onChangeValue={(value: number) => onChange(value)}
                      {...rest}
                    />
                  )}
                />
              );
            }

            return <span>{value ? formatBigNumber(value) : 0}</span>;
          },
        },
        {
          title: t("table.promotionPrice"),
          dataIndex: "promotionPrice",
          align: "center",
          render: (value: number, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.promotionPrice`}
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <InputNumber
                      className="w-[200px]"
                      placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                      value={!!value ? formatBigNumber(value) : 0}
                      maximum={999999999}
                      error={!!errors[record.id]?.promotionPrice}
                      errorMessage={errors[record.id]?.promotionPrice?.message}
                      onChangeValue={(value: number) => onChange(value)}
                      {...rest}
                    />
                  )}
                />
              );
            }

            return <span>{value ? formatBigNumber(value) : 0}</span>;
          },
        },
        {
          title: t("table.stock"),
          dataIndex: "stock",
          align: "center",
          render: (value: number, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.stock`}
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <InputNumber
                      className="w-[200px]"
                      placeholder={tError(MESSAGE_ERROR.PLEASE_INPUT)}
                      value={!!value ? formatBigNumber(value) : 0}
                      maximum={999999999}
                      error={!!errors[record.id]?.stock}
                      errorMessage={errors[record.id]?.stock?.message}
                      onChangeValue={(value: number) => onChange(value)}
                      {...rest}
                    />
                  )}
                />
              );
            }

            return <span>{value ? formatBigNumber(value) : 0}</span>;
          },
        },
        {
          title: t("table.status"),
          dataIndex: "status",
          align: "center",
          render: (value: ENUM_PRODUCT_STATUS, record) => {
            if (getValues(record.id)) {
              return (
                <Controller
                  name={`${record.id}.isActive`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Switch
                      className="w-fit"
                      checked={value}
                      onChange={onChange}
                    />
                  )}
                />
              );
            }

            return getStatusEl(value);
          },
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

              {getValues(record.id) && (
                <BtnClose onClick={handleSubmit(() => onCancelEdit(record))} />
              )}

              {ability.can(EPermisisonAction.DELETE, EPageRole.ADMIN_PRODUCT) &&
                !getValues(record.id) &&
                infoUser.userId !== record.id && (
                  <BtnTrash
                    onClick={() => {
                      setSelectItem(record);
                      onModal({ delete: true });
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
        loading={loadingProp}
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
        open={modal.delete}
        type="error"
        okButtonProps={{
          loading: loading.delete,
          disabled: loading.delete,
        }}
        onCancel={() => onModal({ delete: false })}
        onOk={() => handleDelete(selectItem.id as string)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
      />

      {/* Modal Select Image */}
      <ModalConfirm
        title={t("modalSelectImage.title")}
        className="xl:!w-1/3 md:!w-1/2"
        open={modal.selectImage}
        type="info"
        onCancel={() => onModal({ selectImage: false })}
        cancelText={tCommon("goBack")}
        okButtonProps={{
          hidden: true,
        }}
        destroyOnClose={true}
      >
        {selectItem && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mt-5 gap-5">
            {product.gallery.map((url, index) => (
              <img
                key={index}
                src={url}
                onClick={() => onSelectImage(url)}
                className={clsx(
                  "rounded-md object-cover object-center cursor-pointer border-2 hover:border-primary-color",
                  [
                    getValues(selectItem.id).thumbnailUrl === url &&
                      "border-primary-color",
                  ],
                )}
              />
            ))}
          </div>
        )}
      </ModalConfirm>
    </div>
  );
};

export default memo(Table);
