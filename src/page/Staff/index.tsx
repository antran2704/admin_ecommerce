import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { InputSearch } from "~/components/Core/Input";
import { MainLayout } from "~/layout";
import { Filter, GroupAction, Table } from "./components";
import { useStaffs } from "~/page/Staff/hooks";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";
import { EOrderType } from "~/enum/paramater";
import { IGetStaffsRequest, IStaffTable } from "./interfaces";
import { useSelectTableRows } from "~/hooks/table";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

const StaffPage = () => {
  const { t } = useTranslation("StaffPage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    status: statusParam,
  } = useGetSearchParams<IGetStaffsRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    status: "string",
  });

  const paramaterStaff: Partial<IGetStaffsRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      status: statusParam as ENUM_ACCOUNT_STATUS,
    };
  }, [search]);

  const {
    staffsTable,
    paginationStaff,
    loadingStaff,
    onPaginationStaff,
    handleGetStaffs,
  } = useStaffs(paramaterStaff);
  
  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IStaffTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetStaffsRequest> = {
      ...paramaterStaff,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetStaffsRequest>) => {
    const newParams: Partial<IGetStaffsRequest> = {
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
              defaultValue={paramaterStaff.search}
              onChangeValue={onChangeSearch}
            />
            <Filter filter={paramaterStaff} onFilter={onFilter} />
          </div>
          <GroupAction
            data={selectedRows.length > 0 ? selectedRows : staffsTable}
            handleGetData={() =>
              handleGetStaffs({ ...paramaterStaff, page: 1 })
            }
          />
        </div>

        <div className="py-10">
          <Table
            items={staffsTable}
            pagination={paginationStaff}
            loading={loadingStaff}
            selectedRowKeys={selectedRowKeys}
            getData={() => handleGetStaffs(paramaterStaff)}
            onPagination={onPaginationStaff}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffPage;
