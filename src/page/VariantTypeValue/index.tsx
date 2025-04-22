import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import { InputSearch } from "~/components/Core/Input";
import { Filter, GroupAction, Table } from "./components";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import { parseQueryString } from "~/helper/url";
import { EOrderType } from "~/enum/paramater";
import { useSelectTableRows } from "~/hooks/table";
import {
  IGetVariantTypeValuesRequest,
  IVariantTypeValueTable,
} from "./interfaces";
import { useVariantTypeValues } from "./hooks";

interface Props {
  variantTypeId: string;
}

const VariantTypeValueManage = (props: Props) => {
  const { variantTypeId } = props;
  const { t } = useTranslation("VariantTypeValuePage");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
    tab: tabParam
  } = useGetSearchParams<Partial<IGetVariantTypeValuesRequest>>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    tab: "string"
  });

  const [paramater, setParamater] = useState<Partial<IGetVariantTypeValuesRequest>>({
    page: currentPageParam ? Number(currentPageParam) : 1,
    take: pageSizeParam ? Number(pageSizeParam) : 16,
    order: (orderPageParam as EOrderType) || EOrderType.DESC,
    search: (searchTextParam as string) || "",
    variantTypeId,
    tab: tabParam as string
  });

  const {
    variantTypeValueTables,
    paginationVariantTypeValues,
    loadingVariantTypeValues,
    onPaginationVariantTypeValues,
    handleGetVariantTypeValues,
  } = useVariantTypeValues(paramater);

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IVariantTypeValueTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetVariantTypeValuesRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
    setParamater(newParams);
  };

  const onFilter = (values: Partial<IGetVariantTypeValuesRequest>) => {
    const newParams: Partial<IGetVariantTypeValuesRequest> = {
      ...values,
    };

    navigate(pathname + parseQueryString(newParams));
    setParamater(newParams);
  };

  return (
    <div className="py-5">
      <div className="flex items-center justify-between">
        <div className="3xl:w-3/12 w-4/12 flex items-center gap-4">
          <InputSearch
            placeholder={t("searchTitle")}
            defaultValue={paramater.search}
            onChangeValue={onChangeSearch}
          />
          <Filter filter={paramater} onFilter={onFilter} />
        </div>
        <GroupAction
          data={selectedRows.length > 0 ? selectedRows : variantTypeValueTables}
        />
      </div>

      <div className="py-10">
        <Table
          items={variantTypeValueTables}
          pagination={paginationVariantTypeValues}
          loading={loadingVariantTypeValues}
          selectedRowKeys={selectedRowKeys}
          getData={() => handleGetVariantTypeValues(paramater)}
          onPagination={onPaginationVariantTypeValues}
          onSelectedRowKeys={onSelectedRowKeys}
          onSelectedRows={onSelectedRows}
        />
      </div>
    </div>
  );
};

export default VariantTypeValueManage;
