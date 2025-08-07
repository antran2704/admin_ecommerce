import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { InputSearch } from "~/components/Core/Input";
import { MainLayout } from "~/layout";
import { Filter, GroupAction, Table } from "./components";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";
import { EOrderType } from "~/enum/paramater";
import { useSelectTableRows } from "~/hooks/table";
import { IGetOrdersRequest } from "./interfaces";
import { ENUM_ORDER_STATUS } from "./enums";
import useOrders from "./hooks/useOrders";
import { IOrderTable } from "./interfaces/orderTable.interface";

const OrderPage = () => {
  const { t } = useTranslation("OrderPage");
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    status: statusParam,
  } = useGetSearchParams<IGetOrdersRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    status: "string",
  });

  const paramater: Partial<IGetOrdersRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      status: statusParam as ENUM_ORDER_STATUS,
    };
  }, [search]);

  const { data, isLoading, orderTables, onPaginationOrders } =
    useOrders(paramater);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IOrderTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetOrdersRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetOrdersRequest>) => {
    const newParams: Partial<IGetOrdersRequest> = {
      ...values,
    };

    navigate(pathname + parseQueryString(newParams));
  };

  return (
    <MainLayout
      titleText={t("title")}
      className="bg-white"
      listBreadcrumb={[{ title: t("breadcrumb.list") }]}
    >
      <div className="py-5">
        <div className="flex items-center justify-between">
          <div className="3xl:w-3/12 w-4/12 flex items-center gap-4">
            <InputSearch
              placeholder={t("searchTitle")}
              defaultValue={paramater.search}
              onChangeValue={onChangeSearch}
            />
            <Filter filter={paramater} onFilter={onFilter} />
          </div>
          <GroupAction
            data={selectedRows.length > 0 ? selectedRows : orderTables}
          />
        </div>

        <div className="py-10">
          <Table
            items={orderTables}
            pagination={data?.pagination}
            loading={isLoading}
            selectedRowKeys={selectedRowKeys}
            onPagination={onPaginationOrders}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderPage;
