import { useTranslation } from "react-i18next";
import { useState } from "react";
import dayjs from "dayjs";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";

import {
  FillByPackageChart,
  FillByFloor,
  Filter,
  InComeChart,
  IncomeServiceChart,
  StatisticDashboard,
} from "./components";
import { IDashboardFilter } from "~/interface/dashboard";
import { ENUM_CURRENCY } from "~/enum/currency";
import { ENUM_DATE_FILTER } from "~/enum/filter";

const HomePage = () => {
  const { t } = useTranslation("HomePage");

  const [filter, setFilter] = useState<IDashboardFilter>({
    buildingId: "",
    currency: ENUM_CURRENCY.VND,
    unitOfDate: ENUM_DATE_FILTER.YEAR,
    startDate: dayjs().startOf("year").toISOString(),
    endDate: dayjs().endOf("year").toISOString(),
  });

  const [buildingName, setBuildingName] = useState<string>("");

  const onChangeFilter = (value: IDashboardFilter) => {
    setFilter(value);
  };

  return (
    <div className="flex flex-col gap-y-10">
      <h2 className="lg:text-2xl md:text-xl font-semibold text-gray-950">
        {t("statistics")}
      </h2>

      <Filter
        filter={filter}
        onChangeFilter={onChangeFilter}
        onSelectBuilding={(value) => setBuildingName(value)}
      />
      <StatisticDashboard filter={filter} />

      <FillByFloor filter={filter} buildingName={buildingName} />

      <FillByPackageChart filter={filter} />

      <div className="flex items-start justify-between xl:flex-nowrap flex-wrap pb-20 gap-10">
        <div className="xl:w-1/3 w-full md:mx-auto">
          <IncomeServiceChart filter={filter} />
        </div>
        <div className="xl:w-2/3 w-full">
          <InComeChart filter={filter} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
