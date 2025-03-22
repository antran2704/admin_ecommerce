import { ENUM_CURRENCY } from "~/enum/currency";
import { ENUM_DATE_FILTER } from "~/enum/filter";

interface IDashboardOverviewItem {
  total: number;
  changeRate: number;
  changeRateType: "-" | "+";
  packageName?: string;
}

interface IDashboardOverview {
  revenue: IDashboardOverviewItem;
  totalNewUsers: IDashboardOverviewItem;
  totalRenteds: IDashboardOverviewItem[];
  totalBookings: IDashboardOverviewItem;
}

interface IDashboardFloorOccupancy {
  unit: string;
  total: number;
  occupied: number;
  available: number;
  occupancyRate: number;
  availableRate: number;
}

interface IDashboardPackageOccupancy {
  packageId: string;
  package: string;
  total: number;
  occupied: number;
  available: number;
  rate: number;
}

interface IDashboardRentedRevenue {
  packageId: string;
  total: number;
}

interface IDashboardUtilityRevenue {
  total: number;
  type: any;
  utilityId: string;
}

interface IDashboardFilter {
  currency: ENUM_CURRENCY;
  buildingId: string;
  unitOfDate: ENUM_DATE_FILTER;
  startDate: string;
  endDate: string;
}

export type {
  IDashboardFilter,
  IDashboardOverview,
  IDashboardFloorOccupancy,
  IDashboardPackageOccupancy,
  IDashboardRentedRevenue,
  IDashboardUtilityRevenue,
};
