import dayjs from "dayjs";

import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import { IDashboardFilter } from "~/interface/dashboard";

const getDashboardOverview = async (paramater: Partial<IDashboardFilter>) => {
  // if (paramater.startDate) {
  //   paramater.startDate = dayjs(paramater.startDate)
  //     .add(7, "hour")
  //     .toISOString();
  // }

  if (paramater.endDate) {
    paramater.endDate = dayjs(paramater.endDate).add(7, "hour").toISOString();
  }

  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      "/dahsboards/overview" +
      parseParamater,
  ).then((res) => res.data);
};

const getDashboardFloorOccupancy = async (
  paramater: Partial<IDashboardFilter>,
) => {
  // if (paramater.startDate) {
  //   paramater.startDate = dayjs(paramater.startDate)
  //     .add(7, "hour")
  //     .toISOString();
  // }

  if (paramater.endDate) {
    paramater.endDate = dayjs(paramater.endDate).add(7, "hour").toISOString();
  }

  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      "/dahsboards/floor-occupancy-rate" +
      parseParamater,
  ).then((res) => res.data);
};

const getDashboardPackageOccupancy = async (
  paramater: Partial<IDashboardFilter>,
) => {
  // if (paramater.startDate) {
  //   paramater.startDate = dayjs(paramater.startDate)
  //     .add(7, "hour")
  //     .toISOString();
  // }

  if (paramater.endDate) {
    paramater.endDate = dayjs(paramater.endDate).add(7, "hour").toISOString();
  }
  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      "/dahsboards/package-occupancy-overview" +
      parseParamater,
  ).then((res) => res.data);
};

const getDashboardRentedRevenue = async (
  paramater: Partial<IDashboardFilter>,
) => {
  // if (paramater.startDate) {
  //   paramater.startDate = dayjs(paramater.startDate)
  //     .add(7, "hour")
  //     .toISOString();
  // }

  if (paramater.endDate) {
    paramater.endDate = dayjs(paramater.endDate).add(7, "hour").toISOString();
  }
  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      "/dahsboards/rented-revenue" +
      parseParamater,
  ).then((res) => res.data);
};

const getDashboardUtilityRevenue = async (
  paramater: Partial<IDashboardFilter>,
) => {
  // if (paramater.startDate) {
  //   paramater.startDate = dayjs(paramater.startDate)
  //     .add(7, "hour")
  //     .toISOString();
  // }

  if (paramater.endDate) {
    paramater.endDate = dayjs(paramater.endDate).add(7, "hour").toISOString();
  }
  const parseParamater = parseQueryString(paramater);

  return await AxiosClient.get(
    BASE_URL +
      API_VERSION.V1 +
      INTERNAL_PATH +
      "/dahsboards/utility-revenue" +
      parseParamater,
  ).then((res) => res.data);
};

export {
  getDashboardOverview,
  getDashboardFloorOccupancy,
  getDashboardPackageOccupancy,
  getDashboardRentedRevenue,
  getDashboardUtilityRevenue,
};
