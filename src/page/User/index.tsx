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
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IGetUsersRequest, IUserTable } from "./interfaces";
import { useUsers } from "./hooks";

const UserPage = () => {
  const { t } = useTranslation("UserPage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    status: statusParam,
  } = useGetSearchParams<IGetUsersRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    status: "string",
  });

  const paramaterUsers: Partial<IGetUsersRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
      status: statusParam as ENUM_ACCOUNT_STATUS,
    };
  }, [search]);

  const {
    usersTable,
    paginationUsers,
    loadingUsers,
    onPaginationUsers,
    handleGetUsers,
  } = useUsers(paramaterUsers);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IUserTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetUsersRequest> = {
      ...paramaterUsers,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetUsersRequest>) => {
    const newParams: Partial<IGetUsersRequest> = {
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
              defaultValue={paramaterUsers.search}
              onChangeValue={onChangeSearch}
            />
            <Filter filter={paramaterUsers} onFilter={onFilter} />
          </div>
          <GroupAction
            data={selectedRows.length > 0 ? selectedRows : usersTable}
          />
        </div>

        <div className="py-10">
          <Table
            items={usersTable}
            pagination={paginationUsers}
            loading={loadingUsers}
            selectedRowKeys={selectedRowKeys}
            getData={() => handleGetUsers(paramaterUsers)}
            onPagination={onPaginationUsers}
            onSelectedRowKeys={onSelectedRowKeys}
            onSelectedRows={onSelectedRows}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default UserPage;
