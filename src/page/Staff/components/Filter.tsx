import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterCore } from "~/components/Core";
import SelectItems from "~/components/Select/SelectItems";
import { EOrderType } from "~/enum/paramater";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IGetStaffsRequest } from "../interfaces";

interface Props {
  filter?: IGetStaffsRequest;
  onFilter?: (newParamter: IGetStaffsRequest) => void;
}

const Filter = (props: Props) => {
  const { filter, onFilter } = props;

  const { t } = useTranslation("StaffPage");
  const { t: tFilter } = useTranslation("Filter");

  const [formFilter, setFormFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<IGetStaffsRequest>]: string | string[] | number;
  }>({});

  const onSelectStatus = (value: ENUM_ACCOUNT_STATUS[]) => {
    setFormFilter({
      ...formFilter,
      status: value,
    });
  };

  const onClearFilter = () => {
    const newParams: Partial<IGetStaffsRequest> = {
      page: 1,
      take: 16,
      order: EOrderType.DESC,
      search: "",
    };

    onFilter(newParams);
  };

  const handleFilter = () => {
    onFilter(formFilter as any);
  };

  useEffect(() => {
    setFormFilter(filter);
  }, [filter]);

  return (
    <FilterCore
      title={tFilter("title")}
      filter={formFilter}
      onClearFilter={onClearFilter}
      onFilter={handleFilter}
      width={600}
    >
      <Fragment>
        {/* group */}
        {/* <div className="w-full">
            <SelectFilter
              options={[
                {
                  value: "1",
                  label: "Admin",
                },
                {
                  value: "2",
                  label: "Phòng dự án",
                },
                {
                  value: "3",
                  label: "Phòng nhân sự",
                },
              ]}
              placeholder={tCommon("placeholder.select")}
              value={formFilter?.group}
              title={t("filter.department")}
              allowClear
              onChange={(value) => onSelect(value, "group")}
            />
          </div> */}

        {/* Role */}
        {/* <div className="w-full">
            <SelectFilter
              options={[
                {
                  value: "1",
                  name: "role",
                  label: "Admin",
                },
                {
                  value: "2",
                  name: "role",
                  label: "Phòng dự án",
                },
                {
                  value: "3",
                  name: "role",
                  label: "Phòng nhân sự",
                },
              ]}
              placeholder={tCommon("placeholder.select")}
              value={formFilter?.role}
              title={t("filter.role")}
              allowClear
              onChange={(value) => onSelect(value, "role")}
            />
          </div> */}

        {/* CreatedAt */}
        {/* <div>
            <p
              className={clsx(
                "pb-2 text-base text-gray-700 dark:text-gray-700 font-medium",
              )}
            >
              {t("filter.createdAt")}
            </p>
            <div className="flex items-center md:flex-row flex-col gap-5">
              <div className="md:w-1/2 w-full">
                <DateSelect
                  placeholder={tCommon("placeholder.select")}
                  allowClear
                />
              </div>
              <div className="md:w-1/2 w-full">
                <DateSelect
                  placeholder={tCommon("placeholder.select")}
                  allowClear
                />
              </div>
            </div>
          </div> */}

        {/* Status */}
        <div>
          <p
            className={clsx(
              "pb-2 text-base text-gray-700 dark:text-gray-700 font-medium",
            )}
          >
            {t("filter.status")}
          </p>
          <SelectItems
            options={[
              {
                label: tFilter("status.active"),
                value: ENUM_ACCOUNT_STATUS.ACTIVE,
              },
              {
                label: tFilter("status.inactive"),
                value: ENUM_ACCOUNT_STATUS.INACTIVE,
              },
            ]}
            value={formFilter?.status as ENUM_ACCOUNT_STATUS}
            onChange={onSelectStatus}
          />
        </div>
      </Fragment>
    </FilterCore>
  );
};

export default Filter;
