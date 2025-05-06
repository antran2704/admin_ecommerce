import clsx from "clsx";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterCore } from "~/components/Core";
import SelectItems from "~/components/Select/SelectItems";
import { EOrderType } from "~/enum/paramater";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import { IGetUsersRequest } from "../interfaces";

interface Props {
  filter?: IGetUsersRequest;
  onFilter?: (newParamter: IGetUsersRequest) => void;
}

const Filter = (props: Props) => {
  const { filter, onFilter } = props;

  const { t } = useTranslation("UserPage");
  const { t: tFilter } = useTranslation("Filter");

  const [formFilter, setFormFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<IGetUsersRequest>]: string | string[] | number;
  }>({});

  const onSelectStatus = (value: ENUM_ACCOUNT_STATUS[]) => {
    setFormFilter({
      ...formFilter,
      status: value,
    });
  };

  const onClearFilter = () => {
    const newParams: Partial<IGetUsersRequest> = {
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
