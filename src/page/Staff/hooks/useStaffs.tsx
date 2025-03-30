import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { apiStaffService } from "~/api-client/staff";
import { initPagination } from "~/common/pagination";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { parseQueryString } from "~/helper/url";
import { IResponseDataWithPagination } from "~/interface";
import { IPagination } from "~/interface/pagination";
import { IGetStaffsRequest, IListStaffResponse, IStaffTable } from "~/page/Staff/interfaces";

const useStaffs = (query?: Partial<IGetStaffsRequest>) => {
  const { t: tCommon } = useTranslation("Common");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IListStaffResponse[]>([]);
  const [dataTable, setDataTabel] = useState<IStaffTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetData = async (paramater: Partial<IGetStaffsRequest>) => {
    setLoading(true);

    await apiStaffService.staffs(paramater)
      .then(({ data, pagination }: IResponseDataWithPagination<IListStaffResponse[]>) => {
        const dataTable: IStaffTable[] = data.map((staff: IListStaffResponse) => ({
          id: staff.userId,
          key: staff.userId,
          email: staff.email,
          name: staff.name ? staff.name : tCommon("noData"),
          groupRole: staff.groupRole,
          role: staff.role,
          createdAt: staff.createdAt,
          status: staff.isActive
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
      })
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetData(query);
  }, [query]);

  return {
    staffs: data,
    staffsTable: dataTable,
    handleGetStaffs: handleGetData,
    onPaginationStaff: onPagination,
    paginationStaff: pagination,
    loadingStaff: loading,
  };
};

export default useStaffs;
