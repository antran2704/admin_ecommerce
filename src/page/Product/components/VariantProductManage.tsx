import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Divider } from "antd";

import SelectVariant from "./SelectVariant";
import SelectVariantValue from "./SelectVariantValue";
import { ISelectVariantProductForm } from "../interfaces/selectVariantForm.interface";
import { initSelectVariantForm } from "../common/selectVariantForm";
import { selectVariantFormSchema } from "../schema/selectVariantForm.schema";
import { InputSearch } from "~/components/Core/Input";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import {
  IGetVariantProductsRequest,
  IVariantProductTable,
} from "../interfaces";
import { EOrderType } from "~/enum/paramater";
import { parseQueryString } from "~/helper/url";
import Filter from "./VariantFilter";
import GroupAction from "./VariantGroupAction";
import { useSelectTableRows } from "~/hooks/table";
import Table from "./VariantTable";

const VariantProductManage = () => {
  const { t } = useTranslation("VariantProductPage");
  const { t: tError } = useTranslation("Error");

  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const {
    order: orderPageParam,
    page: currentPageParam,
    take: pageSizeParam,
    search: searchTextParam,
  } = useGetSearchParams<IGetVariantProductsRequest>({
    order: "string",
    page: "number",
    take: "number",
    search: "string",
    productId: "string",
  });

  const paramater: Partial<IGetVariantProductsRequest> = useMemo(() => {
    return {
      page: currentPageParam ? Number(currentPageParam) : 1,
      take: pageSizeParam ? Number(pageSizeParam) : 16,
      order: (orderPageParam as EOrderType) || EOrderType.DESC,
      search: (searchTextParam as string) || "",
    };
  }, [search]);

  const form = useForm<ISelectVariantProductForm>({
    defaultValues: initSelectVariantForm,
    resolver: yupResolver(selectVariantFormSchema(tError)) as any,
  });

  const { selectedRows, selectedRowKeys, onSelectedRows, onSelectedRowKeys } =
    useSelectTableRows<IVariantProductTable>();

  const onChangeSearch = (value: string) => {
    const newParams: Partial<IGetVariantProductsRequest> = {
      ...paramater,
      search: value.trim(),
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onFilter = (values: Partial<IGetVariantProductsRequest>) => {
    const newParams: Partial<IGetVariantProductsRequest> = {
      ...values,
    };

    navigate(pathname + parseQueryString(newParams));
  };

  const onSubmit = (data: ISelectVariantProductForm) => {
    console.log(data);
  };

  return (
    <div className="py-5">
      <div className="flex items-center flex-wrap gap-5">
        <div className="flex-1 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
          <SelectVariant form={form} />

          {form.watch("variants").map((variant) => (
            <SelectVariantValue
              key={variant.value}
              variantTypeId={variant.value as string}
              variantTypeName={variant.label as string}
              form={form}
            />
          ))}
        </div>
        <Button
          size="large"
          type="primary"
          disabled={!form.watch("variants").length}
          onClick={form.handleSubmit(onSubmit)}
        >
          Generate
        </Button>
      </div>
      <Divider />
      <div className="flex items-center justify-between mt-5">
        <div className="3xl:w-3/12 w-4/12 flex items-center gap-4">
          <InputSearch
            placeholder={t("searchTitle")}
            defaultValue={paramater.search}
            onChangeValue={onChangeSearch}
          />
          <Filter filter={paramater} onFilter={onFilter} />
        </div>
        <GroupAction data={selectedRows.length > 0 ? selectedRows : []} />
      </div>

      <div className="py-10">
        <Table
          items={[]}
          //   pagination={paginationProducts}
          //   loading={loadingProducts}
          selectedRowKeys={selectedRowKeys}
          getData={() => {}}
          onPagination={() => {}}
          onSelectedRowKeys={onSelectedRowKeys}
          onSelectedRows={onSelectedRows}
        />
      </div>
    </div>
  );
};

export default VariantProductManage;
