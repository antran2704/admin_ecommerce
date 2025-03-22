import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import FillByFloorChart from "./FillByFloorChart";
import { IDashboardFilter } from "~/interface/dashboard";

interface Props {
  filter: IDashboardFilter;
  buildingName: string;
}

const FillByFloor = (props: Props) => {
  const { buildingName } = props;
  const { t } = useTranslation("HomePage");

  return (
    <div className="w-full h-full">
      <h3 className={clsx("lg:text-xl text-lg font-medium mb-5")}>
        {t("fillRateByFloor")}
      </h3>

      <div className="bg-neutral-50 p-5 2xl:h-[460px] lg:h-[400px] rounded-md shadow-lg">
        <div className="flex md:flex-row flex-col items-start justify-between gap-10">
          <div className="2xl:w-[300px] 2xl:h-[300px] lg:w-[200px] lg:h-[260px] w-full">
            <FillByFloorChart
              title={buildingName}
              available={0}
              occupancy={0}
            />
          </div>
          <Swiper
            className="!pb-10 w-full"
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            pagination={{
              clickable: true,
              enabled: true,
              type: "bullets",
              dynamicBullets: true,
            }}
            modules={[Pagination]}>
            
          </Swiper>
        </div>

        <ul className="flex flex-col w-fit mt-5 ml-auto gap-2">
          <li className="flex items-center gap-2">
            <span className="w-7 h-5 rounded-lg bg-[#57A677]"></span>
            {t("fillRateByFloorChart.rate")} {t("fillRateByFloorChart.fill")}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-7 h-5 rounded-lg bg-[#E3E3E3]"></span>
            {t("fillRateByFloorChart.rate")} {t("fillRateByFloorChart.empty")}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FillByFloor;
