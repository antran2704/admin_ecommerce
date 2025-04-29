import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { initPagination } from "~/common/pagination";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import { IGetUsersRequest, IListUserResponse, IUserTable } from "../interfaces";
import { apiUserService } from "~/api-client/user";

const useUsers = (query?: Partial<IGetUsersRequest>) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IListUserResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IUserTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetUsersRequest>) => {
    setLoading(true);

    await apiUserService
      .users(paramater)
      .then(
        ({
          data,
          pagination,
        }: IResponseDataWithPagination<IListUserResponse[]>) => {
          const dataTable: IUserTable[] = data.map((x: IListUserResponse) => ({
            id: x.userId,
            key: x.userId,
            email: x.email,
            phoneNumber: x.phoneNumber,
            name: x.name,
            providers: x.providers.map((provider) => provider.provider),
            createdAt: x.createdAt,
            status: x.isActive
              ? ENUM_ACCOUNT_STATUS.ACTIVE
              : ENUM_ACCOUNT_STATUS.INACTIVE,
          }));

          setData(data);
          setDataTabel(dataTable);
          setPagination({
            page: pagination.page,
            take: pagination.take,
            total: pagination.total,
          });
        },
      )
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    users: data,
    usersTable: dataTable,
    handleGetUsers: handleGetData,
    onPaginationUsers: onPagination,
    paginationUsers: pagination,
    loadingUsers: loading,
  };
};

export default useUsers;
