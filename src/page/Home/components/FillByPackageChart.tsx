import { ChartData, ChartOptions } from "chart.js";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { ChartCore } from "~/components/Core";
import { MONTHS } from "~/constants/datetime";
import { ENUM_DATE_FILTER } from "~/enum/filter";
import { IDashboardFilter } from "~/interface/dashboard";
import { DAY_DMY } from "~/common/format";

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxHeight: 20,
        boxWidth: 20,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        font: {
          size: 14,
        },
      },
    },
    title: {
      display: false,
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
      stacked: true,
    },
    y: {
      stacked: true,
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

const FillByPackage = (props: Props) => {
  const { filter } = props;
  const { t } = useTranslation("HomePage");

  const [data, setData] = useState<ChartData<"bar", any[], unknown>>({
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
    <div className="w-full h-full">
      <h3 className={clsx("lg:text-xl text-lg font-medium mb-5")}>
        {t("fillRateByPackage")}
      </h3>

      <div className="bg-neutral-50 px-5 pb-16 pt-5 h-[500px] rounded-md shadow-lg">
        <ChartCore
          type="bar"
          options={options}
          data={data}
          className="w-full !h-full"
        />
      </div>
    </div>
  );
};

export default FillByPackage;
