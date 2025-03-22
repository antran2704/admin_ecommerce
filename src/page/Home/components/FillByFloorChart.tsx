import { ChartOptions } from "chart.js";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChartCore } from "~/components/Core";

interface Props {
  title?: string;
  available: number;
  occupancy: number;
  showLegend?: boolean;
}

const FillByFloorChart = (props: Props) => {
  const {
    title = "",
    showLegend = false,
    available = 0,
    occupancy = 0,
  } = props;
  const { t, i18n } = useTranslation("HomePage");

  const options: ChartOptions<"pie"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          display: showLegend,
          position: "right",
          labels: {
            boxHeight: 20,
            boxWidth: 20,
            usePointStyle: true,
            pointStyle: "rectRounded",
            padding: 20,
            font: {
              size: 14,
            },
          },
        },
        title: {
          display: true,
          text: title,
          position: "bottom",
          font: {
            size: 18,
          },
        },
        tooltip: {
          titleColor: "#000",
          backgroundColor: "#fff",
          callbacks: {
            title: function (tooltipItem) {
              const labels = tooltipItem[0].chart.data.labels;
              const values = tooltipItem[0].dataset.data;
              let total: number = 0;
              const titles: string[] = [];

              for (let i = 0; i < values.length; i++) {
                total += values[i];
                titles.push(`${labels[i]}: ${values[i]}`);
              }

              titles.push(`${t("fillRateByFloorChart.total")}: ${total}`);

              return titles;
            },
            label: () => "",
          },
        },
        datalabels: {
          color: "#424752",
          font: {
            size: 14,
            weight: "bold",
          },
          align: "center",
          formatter: (value: number) => {
            return `${value}%`;
          },
        },
      },
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
      },
    }),
    [i18n.resolvedLanguage, title],
  );

  const data = useMemo(
    () => ({
      labels: [t("fillRateByFloorChart.empty"), t("fillRateByFloorChart.fill")],
      datasets: [
        {
          label: "Value",
          data: [occupancy, available],
          backgroundColor: ["#E3E3E3", "#57A677"],
        },
      ],
    }),
    [i18n.resolvedLanguage, occupancy, available],
  );

  return (
    <ChartCore
      type="pie"
      options={options as any}
      data={data}
      className="w-full !h-full"
    />
  );
};

export default FillByFloorChart;
