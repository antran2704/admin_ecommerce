import { ChartData, ChartOptions } from "chart.js";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { POINT_CURRENCY, VND_CURRENCY } from "~/common/currency";
import { ChartCore } from "~/components/Core";
import { ENUM_CURRENCY } from "~/enum/currency";
import { IDashboardFilter } from "~/interface/dashboard";

const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      labels: {
        usePointStyle: true,
        pointStyle: "rectRounded",
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
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },
};

interface Props {
  filter: IDashboardFilter;
}

const IncomeServiceChart = (props: Props) => {
  const { filter } = props;

  const { t, i18n } = useTranslation("HomePage");
  const { t: tUtility } = useTranslation("UtilityType");

  const [data, setData] = useState<ChartData<"pie", any[], unknown>>({
    labels: [],
    datasets: [],
  });

  return (
    <div className="w-full">
      <h3 className={clsx("lg:text-xl text-lg font-medium mb-5")}>
        {t("serviceIncome")}
      </h3>
      <div className="w-full h-full bg-white shadow rounded-lg px-5 pt-5 pb-10">
        <h3 className="md:text-xl text-lg font-semibold">
          372{" "}
          {filter.currency === ENUM_CURRENCY.VND
            ? VND_CURRENCY
            : POINT_CURRENCY}
        </h3>

        <div className="2xl:h-[400px] h-[300px]">
          <ChartCore
            type="pie"
            options={options as any}
            data={data}
            className="w-full !h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default IncomeServiceChart;
