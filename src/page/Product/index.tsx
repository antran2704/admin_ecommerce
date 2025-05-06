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
import useProducts from "./hooks/useProducts";
import { IGetProductsRequest, IProductTable } from "./interfaces";
import { ENUM_PRODUCT_STATUS } from "./enums";

const ProductPage = () => {
  const { t } = useTranslation("ProductPage");
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    status: statusParam,
    categoryId: categoryIdParam,
  } = useGetSearchParams<IGetProductsRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    categoryId: "string",
    status: "string",
  });

  const paramater: Partial<IGetProductsRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      categoryId: categoryIdParam as string,
      status: statusParam as ENUM_PRODUCT_STATUS,
    };
  }, [search]);

  const {
    productTables,
    paginationProducts,
    loadingProducts,
    onPaginationProducts,
    handleGetProducts,
  } = useProducts(paramater);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IProductTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetProductsRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetProductsRequest>) => {
    const newParams: Partial<IGetProductsRequest> = {
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
            data={selectedRows.length > 0 ? selectedRows : productTables}
          />
        </div>

        <div className="py-10">
          <Table
            items={productTables}
            pagination={paginationProducts}
            loading={loadingProducts}
            selectedRowKeys={selectedRowKeys}
            getData={() => handleGetProducts(paramater)}
            onPagination={onPaginationProducts}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductPage;
