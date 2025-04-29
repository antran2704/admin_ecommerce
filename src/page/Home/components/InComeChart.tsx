import { ChartData, ChartOptions } from "chart.js";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { POINT_CURRENCY, VND_CURRENCY } from "~/common/currency";
import { ChartCore } from "~/components/Core";
import { MONTHS } from "~/constants/datetime";
import { ENUM_CURRENCY } from "~/enum/currency";
import { ENUM_DATE_FILTER } from "~/enum/filter";
import { IDashboardFilter } from "~/interface/dashboard";
import { DAY_DMY } from "~/common/format";

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    title: {
      display: false,
    },
    legend: {
      position: "bottom",
      labels: {
        boxHeight: 10,
        boxWidth: 10,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        font: {
          size: 14,
        },
      },
    },
    datalabels: {
      formatter: () => "",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      offset: true,
    },
  },
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
};

interface Props {
  filter: IDashboardFilter;
}

const InComeLineChart = (props: Props) => {
  const { filter } = props;
  const { t } = useTranslation("HomePage");

  const [data, setData] = useState<ChartData<"line", any[], unknown>>({
    labels: [],
    datasets: [],
  });

  const getChartLabels = (unitOfDate: ENUM_DATE_FILTER, value: string) => {
    switch (unitOfDate) {
      case ENUM_DATE_FILTER.YEAR:
        return MONTHS;
      case ENUM_DATE_FILTER.MONTH:
        return Array.from(
          { length: dayjs(value).daysInMonth() },
          (_, i) => i + 1,
        );
      default:
        return [dayjs(value).format(DAY_DMY)];
    }
  };

  return (
    <div className="w-full">
      <h3 className={clsx("lg:text-xl text-lg font-medium mb-5")}>
        {t("officeIncome")}
      </h3>
      <div className="w-full h-full bg-white shadow rounded-lg p-5">
        <h3 className="md:text-xl text-lg font-semibold mb-5">
          372{" "}
          {filter.currency === ENUM_CURRENCY.VND
            ? VND_CURRENCY
            : POINT_CURRENCY}
        </h3>

        <div className={"2xl:h-[400px] h-[300px]"}>
          <ChartCore
            type="line"
            options={options}
            data={data}
            className="w-full !h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default InComeLineChart;
