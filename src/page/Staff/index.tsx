import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { InputSearch } from "~/components/Core/Input";
import { MainLayout } from "~/layout";
import { StaffFilter, StaffGroupAction, StaffTable } from "./components";
import { useStaffs } from "~/hooks/staff";
import { IStaffSearch, IStaffTable } from "~/interface/staff";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";
import { EOrderType } from "~/enum/paramater";

const StaffPage = () => {
  const { t } = useTranslation("StaffPage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
  } = useGetSearchParams<IStaffSearch>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
  });

  const paramaterStaff: Partial<IStaffSearch> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
    };
  }, [search]);

  const {
    staffsTable,
    paginationStaff,
    loadingStaff,
    onPaginationStaff,
    handleGetStaffs,
  } = useStaffs(paramaterStaff);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<IStaffTable[]>([]);

  const onSelectedRowKeys = (selected: React.Key[]) => {
    setSelectedRowKeys(selected);
  };

  const onSelectedRows = (selectedRows: IStaffTable[]) => {
    setSelectedRows(selectedRows);
  };

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IStaffSearch> = {
      ...paramaterStaff,
      page: 1,
      search: value.trim(),
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
            <StaffFilter />
          </div>
          <StaffGroupAction
            data={selectedRows.length > 0 ? selectedRows : staffsTable}
            handleGetData={() =>
              handleGetStaffs({ ...paramaterStaff, page: 1 })
            }
          />
        </div>

        <div className="py-10">
          <StaffTable
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
