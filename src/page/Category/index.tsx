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
import { ICategoryTable, IGetCategoriesRequest } from "./interfaces";
import { useCategories } from "./hooks";

const CategoryPage = () => {
  const { t } = useTranslation("CategoryPage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    parentId: parentIdParam,
  } = useGetSearchParams<IGetCategoriesRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    parentId: "string",
  });

  const paramaterUsers: Partial<IGetCategoriesRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      parentId: parentIdParam as string,
    };
  }, [search]);

  const {
    categoriesTable,
    paginationCategories,
    loadingCategories,
    onPaginationCategories,
    handleGetCategories,
  } = useCategories(paramaterUsers);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<ICategoryTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetCategoriesRequest> = {
      ...paramaterUsers,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetCategoriesRequest>) => {
    const newParams: Partial<IGetCategoriesRequest> = {
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
              defaultValue={paramaterUsers.search}
              onChangeValue={onChangeSearch}
            />
            <Filter filter={paramaterUsers} onFilter={onFilter} />
          </div>
          <GroupAction
            data={selectedRows.length > 0 ? selectedRows : categoriesTable}
          />
        </div>

        <div className="py-10">
          <Table
            items={categoriesTable}
            pagination={paginationCategories}
            loading={loadingCategories}
            selectedRowKeys={selectedRowKeys}
            getData={() => handleGetCategories(paramaterUsers)}
            onPagination={onPaginationCategories}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
