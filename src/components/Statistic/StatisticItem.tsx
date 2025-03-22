import clsx from "clsx";
import { memo } from "react";
import { formatBigNumber } from "~/helper/format";

import arrowImage from "@assets/images/HomePage/arrow.png";

interface Props {
  title: string;
  value?: number;
  srcImg?: string;
  symbol?: string;
  percent?: number;
  changeRateType?: "-" | "+";
  styles?: {
    wrap?: string;
    title?: string;
    value?: string;
  };
}

const StatisticItem = (props: Props) => {
  const {
    value = 0,
    styles = {
      wrap: "bg-blue-50",
    },
    title,
    srcImg,
    symbol,
    percent = 0,
  } = props;

  return (
    <div
      className={clsx("flex flex-col py-5 px-8 rounded-2xl shadow-lg gap-2", [
        styles?.wrap,
      ])}
    >
      {srcImg && (
        <img
          src={srcImg}
          className="size-6 min-w-6"
          alt="Icon dashboard"
          title="Icon dashboard"
        />
      )}
      <p className={clsx("text-base line-clamp-1", styles?.title)}>{title}</p>
      <div className="flex items-center gap-5">
        <p
          className={clsx("md:text-lg text-base font-semibold", styles?.value)}
        >
          {formatBigNumber(value)} {symbol}
        </p>

        <div className="flex items-center gap-2">
          <span>
            {/* {percent !== 0 && changeRateType} */}
            {formatBigNumber(percent)}%
          </span>
          {percent !== 0 && (
            <img
              src={arrowImage}
              alt="arrow image"
              className={clsx("size-5 min-w-5 object-contain", [
                percent < 0 && "rotate-180",
              ])}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(StatisticItem);
