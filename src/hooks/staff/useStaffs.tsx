import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { getStaffs } from "~/api-client/staff";
import { initPagination } from "~/common/pagination";
import { EOrderType } from "~/enum/paramater";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { parseQueryString } from "~/helper/url";
import { IResponseData } from "~/interface";
import { IPagination } from "~/interface/pagination";
import { IStaff, IStaffSearch, IStaffTable } from "~/interface/staff";

const useStaffs = (query?: Partial<IStaffSearch>) => {
  const { t: tCommon } = useTranslation("Common");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [data, setData] = useState<IStaff[]>([]);
  const [dataTable, setDataTabel] = useState<IStaffTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<IPagination>(initPagination);

  const onPagination = (page: number, take: number) => {
    navigate(pathname + parseQueryString({ ...query, page, take }));
  };

  const handleGetStaffs = async (paramater: Partial<IStaffSearch>) => {
    setLoading(true);

    await getStaffs(paramater)
      .then(({ data, meta }: IResponseData<IStaff[]>) => {
        const dataTable: IStaffTable[] = data.map((staff: IStaff) => ({
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
          total: meta.itemCount,
        });
      })
      .catch((err) => err);

    setLoading(false);
  };

  useEffect(() => {
    if (!query) return;

    handleGetStaffs(query);
  }, [query]);

  return {
    staffs: data,
    staffsTable: dataTable,
    handleGetStaffs,
    onPaginationStaff: onPagination,
    paginationStaff: pagination,
    loadingStaff: loading,
  };
};

export default useStaffs;
