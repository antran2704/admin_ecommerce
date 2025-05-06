import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FilterCore } from "~/components/Core";
import { EOrderType } from "~/enum/paramater";
import { IGetVariantProductsRequest } from "../interfaces";

interface Props {
  filter?: Partial<IGetVariantProductsRequest>;
  onFilter?: (newParamter: Partial<IGetVariantProductsRequest>) => void;
}

const Filter = (props: Props) => {
  const { filter, onFilter } = props;

  const { t: tFilter } = useTranslation("Filter");

  const [formFilter, setFormFilter] = useState<{
    // eslint-disable-next-line no-unused-vars
    [x in keyof Partial<IGetVariantProductsRequest>]:
      | string
      | string[]
      | number;
  }>({});

  const onClearFilter = () => {
    const newParams: Partial<IGetVariantProductsRequest> = {
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
      <Fragment></Fragment>
    </FilterCore>
  );
};

export default Filter;
