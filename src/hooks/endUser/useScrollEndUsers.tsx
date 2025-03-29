import { useEffect, useState } from "react";
import { getEndUsers } from "~/api-client/endUser";
import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";
import { IEndUser, IEndUserSearch } from "~/interface/endUser";
import { IPagination } from "~/interface/pagination";

const useScrollEndUsers = (query?: Partial<IEndUserSearch> | null) => {
  const [data, setData] = useState<IEndUser[]>([]);

  const [paramater, setParameter] = useState<IEndUserSearch>(
    query !== null
      ? {
          page: 1,
          take: 16,
          order: EOrderType.DESC,
          tenantId: "",
          ...query,
        }
      : null,
  );

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number) => {
    setParameter({ ...paramater, page });
  };

  const resetData = (paramater: IEndUserSearch) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IEndUserSearch) => {
    if (pagination.total && pagination.total <= data.length) return;

    await getEndUsers(paramater)
      .then(({ data: services, meta }: IResponseDataWithPagination<IEndUser[]>) => {
        setData([...data, ...services]);
        setPagination({
          page: meta.page,
          take: meta.take,
          total: meta.total,
        });
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater) return;

    getDataScroll(paramater);
  }, [paramater]);

  return {
    endUsers: data,
    paramaterEndUsers: paramater,
    resetEndUsers: resetData,
    onPaginationEndUsers: onPagination,
  };
};

export default useScrollEndUsers;
