import { useTranslation } from "react-i18next";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";

import incomeImage from "@assets/images/HomePage/group.png";
import userGroupImage from "@assets/images/HomePage/user-group.png";
import userImage from "@assets/images/HomePage/users.png";
import { StatisticItem, StatisticItemLoading } from "~/components/Statistic";
import { IDashboardFilter } from "~/interface/dashboard";
import { ENUM_CURRENCY } from "~/enum/currency";
import { POINT_CURRENCY, VND_CURRENCY } from "~/common/currency";

interface Props {
  filter: IDashboardFilter;
}

const Statistic = (props: Props) => {
  const { filter } = props;

  const { t } = useTranslation("HomePage");

  return (
    <div>
      <div className="grid 2xl:rid-cols-4 lg:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center mt-5 gap-10">
        {/* {dashboardOverviewLoading &&
          [...Array(4)].map((_, index) => <StatisticItemLoading key={index} />)} */}
      </div>

      {/* {!dashboardOverviewLoading && (
        <Swiper
          className="!pb-10"
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
              grid: {
                rows: 2,
                fill: "row",
              },
            },
          }}
          pagination={{
            clickable: true,
            enabled: true,
            type: "bullets",
            dynamicBullets: true,
          }}
          modules={[Grid, Pagination]}
        >
          <SwiperSlide>
            <StatisticItem
              title={t("reveune")}
              value={dashboardOverview ? dashboardOverview.revenue.total : 0}
              percent={
                dashboardOverview ? dashboardOverview.revenue.changeRate : 0
              }
              // changeRateType={
              //   dashboardOverview
              //     ? dashboardOverview.revenue.changeRateType
              //     : "+"
              // }
              symbol={
                filter.currency === ENUM_CURRENCY.VND
                  ? VND_CURRENCY
                  : POINT_CURRENCY
              }
              srcImg={incomeImage}
            />
          </SwiperSlide>
          <SwiperSlide>
            <StatisticItem
              title={t("totalNewUsers")}
              value={
                dashboardOverview ? dashboardOverview.totalNewUsers.total : 0
              }
              percent={
                dashboardOverview
                  ? dashboardOverview.totalNewUsers.changeRate
                  : 0
              }
              // changeRateType={
              //   dashboardOverview
              //     ? dashboardOverview.totalNewUsers.changeRateType
              //     : "+"
              // }
              srcImg={userGroupImage}
            />
          </SwiperSlide>
          {dashboardOverview?.totalRenteds.map((item, index) => (
            <SwiperSlide key={index}>
              <StatisticItem
                title={item.packageName}
                value={item ? item.total : 0}
                percent={item ? item.changeRate : 0}
                // changeRateType={item ? item.changeRateType : "+"}
                srcImg={userImage}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )} */}
    </div>
  );
};

export default Statistic;
