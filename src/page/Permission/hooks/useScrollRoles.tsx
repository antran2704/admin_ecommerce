import { useEffect, useState } from "react";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGetRolesRequest, IRoleResponse } from "../interfaces";
import apiRoleService from "~/api-client/role/role";

const useScrollRoles = (query?: Partial<IGetRolesRequest> | null) => {
  const [data, setData] = useState<IRoleResponse[]>([]);

  const [paramater, setParameter] = useState<IGetRolesRequest>(
    query !== null && query?.groupRoleId
      ? {
          page: 1,
          take: 16,
          order: EOrderType.DESC,
          groupRoleId: query.groupRoleId,
          ...query,
        }
      : null,
  );

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number) => {
    setParameter({ ...paramater, page });
  };

  const resetData = (paramater: IGetRolesRequest) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IGetRolesRequest) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiRoleService.getRoles(paramater)
      .then(({ data: services, pagination }: IResponseDataWithPagination<IRoleResponse[]>) => {
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
    if (!paramater || !paramater.groupRoleId) return;

    getDataScroll(paramater);
  }, [paramater]);

  return {
    roles: data,
    paramaterRoles: paramater,
    setParameterRoles: setParameter,
    resetRoles: resetData,
    onPaginationRoles: onPagination,
  };
};

export default useScrollRoles;
