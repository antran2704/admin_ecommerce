import clsx from "clsx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { DateFilter, FilterCore, SelectFilter } from "~/components/Core";
import SelectItems from "~/components/Select/SelectItems";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IStaffSearch, IStaffFilterOption } from "~/interface/staff";

const initSetting: IStaffFilterOption = {
  group: true,
  role: true,
  createdAt: true,
  status: true,
};

interface Props {
  filter?: IStaffSearch;
  optionFilter?: Partial<IStaffFilterOption>;
  onFilter?: (newParamter: IStaffSearch) => void;
}

const StaffFilter = (props: Props) => {
  const { filter, optionFilter, onFilter } = props;

  const setting = useMemo(
    () => ({
      ...initSetting,
      ...optionFilter,
    }),
    [optionFilter],
  );

  const { t } = useTranslation("StaffPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tFilter } = useTranslation("Filter");

  const [formFilter, setFormFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<IStaffSearch>]: string | string[] | number;
  }>({});

  const onSelect = (value: string, key: keyof IStaffFilterOption) => {
    setFormFilter({
      ...formFilter,
      [key]: value,
    });
  };

  const onSelectStatus = (value: ENUM_ACCOUNT_STATUS[]) => {
    setFormFilter({
      ...formFilter,
      status: value,
    });
  };

  const onClearFilter = () => {
    setFormFilter({});
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
        {setting.group && (
          <div className="w-full">
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
          </div>
        )}

        {/* Role */}
        {setting.role && (
          <div className="w-full">
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
          </div>
        )}

        {/* CreatedAt */}
        {setting.createdAt && (
          <div>
            <p
              className={clsx(
                "pb-2 text-base text-gray-700 dark:text-gray-700 font-medium",
              )}
            >
              {t("filter.createdAt")}
            </p>
            <div className="flex items-center md:flex-row flex-col gap-5">
              <div className="md:w-1/2 w-full">
                <DateFilter
                  placeholder={tCommon("placeholder.select")}
                  allowClear
                />
              </div>
              <div className="md:w-1/2 w-full">
                <DateFilter
                  placeholder={tCommon("placeholder.select")}
                  allowClear
                />
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        {setting.status && (
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
                  label: t("filter.active"),
                  value: ENUM_ACCOUNT_STATUS.ACTIVE,
                },
                {
                  label: t("filter.inactive"),
                  value: ENUM_ACCOUNT_STATUS.INACTIVE,
                },
              ]}
              type="multiple"
              onChange={onSelectStatus}
            />
          </div>
        )}
      </Fragment>
    </FilterCore>
  );
};

export default StaffFilter;
