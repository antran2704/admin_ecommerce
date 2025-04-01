import { Button, Segmented } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { POINT_CURRENCY, VND_CURRENCY } from "~/common/currency";
import MESSAGE_ERROR from "~/common/errorMessage";
import { DateSelect, SelectFilter } from "~/components/Core";
import FormField from "~/components/Core/Input/FormField";
import { ENUM_CURRENCY } from "~/enum/currency";
import { ENUM_DATE_FILTER } from "~/enum/filter";
import { IDashboardFilter } from "~/interface/dashboard";
import { DAY_DMY, DAY_MY } from "~/common/format";

interface Props {
  filter: IDashboardFilter;
  onChangeFilter: (value: IDashboardFilter) => void;
  onSelectBuilding: (value: string) => void;
}

const Filter = (props: Props) => {
  const { filter, onChangeFilter, onSelectBuilding } = props;
  const { t } = useTranslation("HomePage");
  const { t: tFilter } = useTranslation("Filter");
  const { t: tError } = useTranslation("Error");

  return (
    <div className="p-5 bg-white rounded-md shadow-lg">
      <div className="flex items-end gap-10">
        <div className="w-3/12">
          <FormField sizeText="small" title={t("filter.follow")}>
            <Segmented
              size="large"
              className="w-fit"
              value={filter.currency}
              options={[
                { label: VND_CURRENCY, value: ENUM_CURRENCY.VND },
                { label: POINT_CURRENCY, value: ENUM_CURRENCY.TINI_POINT },
              ]}
              onChange={(value) =>
                onChangeFilter({ ...filter, currency: value })
              }
            />
          </FormField>
        </div>

        <div className="w-3/12">
          <SelectFilter
            title={t("filter.building")}
            placeholder={tError("PLEASE_SELECT")}
            className="w-full"
            options={[]}
            sizeText="small"
            required={true}
            scrollVitual
            value={filter.buildingId}
            onChange={(value, options: DefaultOptionType) => {
              onChangeFilter({ ...filter, buildingId: value });
              onSelectBuilding(options.label as string);
            }}
          />
        </div>

        <div className="w-3/12">
          <FormField sizeText="small" title={t("filter.follow")}>
            <Segmented
              size="large"
              className="w-fit"
              value={filter.unitOfDate}
              options={[
                {
                  label: tFilter("year"),
                  value: ENUM_DATE_FILTER.YEAR,
                },
                {
                  label: tFilter("month"),
                  value: ENUM_DATE_FILTER.MONTH,
                },
                {
                  label: tFilter("day"),
                  value: ENUM_DATE_FILTER.DAY,
                },
              ]}
              onChange={(value) => {
                if (value === ENUM_DATE_FILTER.YEAR) {
                  onChangeFilter({
                    ...filter,
                    unitOfDate: ENUM_DATE_FILTER.YEAR,
                    startDate: dayjs().startOf("year").toISOString(),
                    endDate: dayjs().endOf("year").toISOString(),
                  });
                }

                if (value === ENUM_DATE_FILTER.MONTH) {
                  onChangeFilter({
                    ...filter,
                    unitOfDate: ENUM_DATE_FILTER.MONTH,
                    startDate: dayjs().startOf("month").toISOString(),
                    endDate: dayjs().endOf("month").toISOString(),
                  });
                }

                if (value === ENUM_DATE_FILTER.DAY) {
                  onChangeFilter({
                    ...filter,
                    unitOfDate: ENUM_DATE_FILTER.DAY,
                    startDate: dayjs().startOf("date").toISOString(),
                    endDate: dayjs().endOf("date").toISOString(),
                  });
                }
              }}
            />
          </FormField>
        </div>

        <div className="w-3/12">
          {filter.unitOfDate === ENUM_DATE_FILTER.YEAR && (
            <DateSelect
              title={t("filter.time")}
              sizeText="small"
              picker="year"
              placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
              format={"YYYY"}
              value={filter.startDate ? dayjs(filter.startDate) : null}
              onChange={(value) =>
                onChangeFilter({
                  ...filter,
                  startDate: value.startOf("year").toISOString(),
                  endDate: value.endOf("year").toISOString(),
                })
              }
            />
          )}
          {filter.unitOfDate === ENUM_DATE_FILTER.MONTH && (
            <DateSelect
              title={t("filter.time")}
              sizeText="small"
              picker="month"
              placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
              format={DAY_MY}
              value={filter.startDate ? dayjs(filter.startDate) : null}
              onChange={(value) =>
                onChangeFilter({
                  ...filter,
                  startDate: value.startOf("month").toISOString(),
                  endDate: value.endOf("month").toISOString(),
                })
              }
            />
          )}
          {filter.unitOfDate === ENUM_DATE_FILTER.DAY && (
            <DateSelect
              title={t("filter.time")}
              sizeText="small"
              placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
              format={DAY_DMY}
              value={filter.startDate ? dayjs(filter.startDate) : null}
              onChange={(value) =>
                onChangeFilter({
                  ...filter,
                  startDate: value.startOf("date").toISOString(),
                  endDate: value.endOf("date").toISOString(),
                })
              }
            />
          )}
        </div>

        <Button className="ml-auto text-blue-400 font-medium" type="text">
          {tFilter("cancel")}
        </Button>
      </div>
    </div>
  );
};

export default Filter;
