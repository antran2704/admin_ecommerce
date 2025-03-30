import { useEffect, useState } from "react";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination, ISearch } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGroupRoleResponse } from "../interfaces";
import { apiGroupRoleService } from "~/api-client/role/groupRole";

const useScrollGroupRoles = (query?: Partial<ISearch> | null) => {
  const [data, setData] = useState<IGroupRoleResponse[]>([]);

  const [paramater, setParameter] = useState<ISearch>(
    query !== null
      ? {
          page: 1,
          take: 16,
          order: EOrderType.DESC,
          ...query,
        }
      : null,
  );

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number) => {
    setParameter({ ...paramater, page });
  };

  const resetData = (paramater: ISearch) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: ISearch) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiGroupRoleService.roleGroups(paramater)
      .then(({ data: services, pagination }: IResponseDataWithPagination<IGroupRoleResponse[]>) => {
        setData([...data, ...services]);
        setPagination({
          page: pagination.page,
          take: pagination.take,
          total: pagination.total,
        });
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater) return;

    getDataScroll(paramater);
  }, [paramater]);

  return {
    groupRoles: data,
    paramaterGroupRoles: paramater,
    resetGroupRoles: resetData,
    onPaginationGroupRoles: onPagination,
  };
};

export default useScrollGroupRoles;
