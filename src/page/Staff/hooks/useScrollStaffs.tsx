import { useEffect, useState } from "react";
import { apiStaffService } from "~/api-client/staff";

import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { IResponseDataWithPagination } from "~/interface";

import { IPagination } from "~/interface/pagination";
import { IGetStaffsRequest, IListStaffResponse } from "~/page/Staff/interfaces";

const useScrollStaffs = (query?: Partial<IGetStaffsRequest> | null) => {
  const [data, setData] = useState<IListStaffResponse[]>([]);

  const [paramater, setParameter] = useState<IGetStaffsRequest>(
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

  const resetData = (paramater: IGetStaffsRequest) => {
    setData([]);
    setParameter(paramater);
    setPagination(initPagination);
  };

  const getDataScroll = async (paramater: IGetStaffsRequest) => {
    if (pagination.total && pagination.total <= data.length) return;

    await apiStaffService.staffs(paramater)
      .then(({ data: services, pagination }: IResponseDataWithPagination<IListStaffResponse[]>) => {
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
    staffs: data,
    paramaterStaffs: paramater,
    resetStaffs: resetData,
    onPaginationStaffs: onPagination,
  };
};

export default useScrollStaffs;
