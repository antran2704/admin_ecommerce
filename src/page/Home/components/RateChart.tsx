import { ChartData, ChartOptions } from "chart.js";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { ChartCore, SelectFilter } from "~/components/Core";

const labels: string[] = [
  "1/2024",
  "2/2024",
  "3/2024",
  "4/2024",
  "5/2024",
  "6/2024",
  "7/2024",
  "8/2024",
  "9/2024",
  "10/2024",
  "11/2024",
  "12/2024",
];

const options: ChartOptions<"bar"> = {
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

const data: ChartData<"line"> = {
  labels,
  datasets: [
    {
      label: "Studio",
      data: [],
      borderColor: "#57A677",
      backgroundColor: "#57A677",
      pointRadius: 0,
    },
    {
      label: "Hotdesk",
      data: [],
      borderColor: "#FECA64",
      backgroundColor: "#FECA64",
      pointRadius: 0,
    },
    {
      label: "Dedicated",
      data: [],
      borderColor: "#F6896C",
      backgroundColor: "#F6896C",
      pointRadius: 0,
    },
    {
      label: "Văn phòng ảo",
      data: [],
      borderColor: "#7EB0FF",
      backgroundColor: "#7EB0FF",
      pointRadius: 0,
    },
    {
      label: "Trống",
      // data: [...new Array(12)].map(() => Math.floor(Math.random() * 100)),
      data: [],
      borderColor: "#E3E3E3",
      backgroundColor: "#E3E3E3",
      pointRadius: 0,
    },
  ],
};

interface Props {
  classNames: {
    chartClassName: string;
  };
}

const InComeLineChart = (props: Props) => {
  const { classNames } = props;
  const { t } = useTranslation("HomePage");

  return (
    <div className="w-full h-full">
      <h2 className={clsx("lg:text-xl text-lg mb-5")}>{t("fillRate")}</h2>
      <div className="w-full h-full bg-white shadow rounded-lg p-5">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-5">
            <SelectFilter
              className="w-[200px] bg-transparent"
              defaultValue={"1"}
              size="small"
              options={[
                { value: "1", label: "Tòa 152 Võ Văn Kiệt" },
                { value: "2", label: "Tòa 253 Hoàng Văn Thụ" },
              ]}
            />
            <SelectFilter
              className="w-[100px] bg-transparent"
              defaultValue={"1"}
              size="small"
              options={[...new Array(12)].map((_, index) => ({
                value: index.toString(),
                label: `Tháng ${index + 1}`,
              }))}
            />
          </div>
        </div>

        <div className={clsx(classNames.chartClassName)}>
          <ChartCore
            type="bar"
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
