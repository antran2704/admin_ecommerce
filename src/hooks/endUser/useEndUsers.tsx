import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getEndUsers } from "~/api-client/endUser";
import { initPagination } from "~/common/pagination";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IEndUser, IEndUserSearch, IEndUserTable } from "~/interface/endUser";
import { IPagination } from "~/interface/pagination";

const useEndUser = (query?: Partial<IEndUserSearch> | null) => {
  const { t: tCommon } = useTranslation("Common");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IEndUser[]>([]);
  const [dataTable, setDataTabel] = useState<IEndUserTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IEndUserSearch>) => {
    setLoading(true);

    await getEndUsers(paramater)
      .then(({ data, meta }: IResponseDataWithPagination<IEndUser[]>) => {
        const dataTable: IEndUserTable[] = data.map((staff: IEndUser) => ({
          id: staff.userId,
          key: staff.userId,
          email: staff.email,
          name: staff.fullName ? staff.fullName : tCommon("noData"),
          groupRole: staff.groups.join(", "),
          role: staff.roleNames.join(", "),
          createdAt: staff.createdAt,
          status: staff.isActive
            ? ENUM_ACCOUNT_STATUS.ACTIVE
            : ENUM_ACCOUNT_STATUS.INACTIVE,
        }));

        setData(data);
        setDataTabel(dataTable);
        setPagination({
          page: meta.page,
          take: meta.take,
          total: meta.total,
        });
      })
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query || !query.tenantId) return;

    handleGetData(query);
  }, [query]);

  return {
    endUsers: data,
    endUsersTable: dataTable,
    handleGetEndUsers: handleGetData,
    onPaginationEndUser: onPagination,
    paginationEndUser: pagination,
    loadingEndUser: loading,
  };
};

export default useEndUser;
