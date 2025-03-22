import { useEffect, useState } from "react";
import { getStaffs } from "~/api-client/staff";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseData } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IStaff, IStaffSearch } from "~/interface/staff";

const useScrollStaffs = (query?: Partial<IStaffSearch> | null) => {
  const [data, setData] = useState<IStaff[]>([]);

  const [paramater, setParameter] = useState<IStaffSearch>(
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

  const resetData = (paramater: IStaffSearch) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IStaffSearch) => {
    if (pagination.total && pagination.total <= data.length) return;

    await getStaffs(paramater)
      .then(({ data: services, meta }: IResponseData<IStaff[]>) => {
        setData([...data, ...services]);
        setPagination({
          page: meta.page,
          take: meta.take,
          total: meta.itemCount,
        });
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater) return;

    getDataScroll(paramater);
  }, [paramater]);

  return {
    staffs: data,
    paramaterStaffs: paramater,
    resetStaffs: resetData,
    onPaginationStaffs: onPagination,
  };
};

export default useScrollStaffs;
