import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Divider } from "antd";

import { InputSearch } from "~/components/Core/Input";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import {
  IGetVariantProductsRequest,
  IVariantProductTable,
} from "../interfaces";
import { EOrderType } from "~/enum/paramater";
import { parseQueryString } from "~/helper/url";
import Filter from "./Filter";
import GroupAction from "./GroupAction";
import { useSelectTableRows } from "~/hooks/table";
import Table from "./Table";
import VariantProductGenerator from "./VariantProductGenerator";
import { useProductContext } from "~/page/Product/hooks";
import { useVariantProducts } from "../hooks";

const VariantProductManage = () => {
  const { t } = useTranslation("VariantProductPage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const { product } = useProductContext();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
  } = useGetSearchParams<IGetVariantProductsRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    productId: "string",
  });

  const paramater: Partial<IGetVariantProductsRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      productId: product.productId,
    };
  }, [search]);

  const {
    variantProductTables,
    loadingVariantProducts,
    paginationVariantProducts,
    onPaginationVariantProducts,
    handleGetVariantProducts,
  } = useVariantProducts(paramater);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IVariantProductTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetVariantProductsRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetVariantProductsRequest>) => {
    const newParams: Partial<IGetVariantProductsRequest> = {
      ...values,
    };

    navigate(pathname + parseQueryString(newParams));
  };

  return (
    <div className="py-5">
      <VariantProductGenerator
        onRefresh={() => handleGetVariantProducts(paramater)}
      />

      <Divider />

      <div className="flex items-center justify-between mt-5">
        <div className="3xl:w-3/12 w-4/12 flex items-center gap-4">
          <InputSearch
            placeholder={t("searchTitle")}
            defaultValue={paramater.search}
            onChangeValue={onChangeSearch}
          />
          <Filter filter={paramater} onFilter={onFilter} />
        </div>
        <GroupAction
          data={selectedRows.length > 0 ? selectedRows : variantProductTables}
        />
      </div>

      <div className="py-10">
        <Table
          items={variantProductTables}
          pagination={paginationVariantProducts}
          loading={loadingVariantProducts}
          selectedRowKeys={selectedRowKeys}
          getData={() => handleGetVariantProducts(paramater)}
          onPagination={onPaginationVariantProducts}
          onSelectedRowKeys={onSelectedRowKeys}
          onSelectedRows={onSelectedRows}
        />
      </div>
    </div>
  );
};

export default VariantProductManage;
