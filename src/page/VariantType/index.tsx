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
import { IGetVariantTypesRequest, IVariantTypeTable } from "./interfaces";
import useVariantTypes from "./hooks/useVariantTypes";

const VariantTypePage = () => {
  const { t } = useTranslation("VariantTypePage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
  } = useGetSearchParams<IGetVariantTypesRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
  });

  const paramater: Partial<IGetVariantTypesRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
    };
  }, [search]);

  const {
    variantTypeTables,
    paginationVariantTypes,
    loadingVariantTypes,
    onPaginationVariantTypes,
    handleGetVariantTypes,
  } = useVariantTypes(paramater);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IVariantTypeTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetVariantTypesRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetVariantTypesRequest>) => {
    const newParams: Partial<IGetVariantTypesRequest> = {
      ...values,
    };

    navigate(pathname + parseQueryString(newParams));
  };

  return (
    <MainLayout
      titleText={t("title")}
      className="bg-white"
      listBreadcrumb={[{ title: t("breadcrumb.list") }]}>
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
            data={selectedRows.length > 0 ? selectedRows : variantTypeTables}
          />
        </div>

        <div className="py-10">
          <Table
            items={variantTypeTables}
            pagination={paginationVariantTypes}
            loading={loadingVariantTypes}
            selectedRowKeys={selectedRowKeys}
            getData={() => handleGetVariantTypes(paramater)}
            onPagination={onPaginationVariantTypes}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VariantTypePage;
