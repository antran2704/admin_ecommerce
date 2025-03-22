import { Pagination, Table, TableProps, PaginationProps } from "antd";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import NoData from "~/components/NoData";

interface Props extends TableProps {
  showPagination?: boolean;
  paginationOptions?: PaginationProps;
}

const TableCore = (props: Props) => {
  const { showPagination = true, paginationOptions, ...rest } = props;

  const { t } = useTranslation("Common");

  return (
    <div className="w-full">
      <div className="scroll w-full max-w-[100vw] overflow-x-auto">
        <Table
          locale={{
            emptyText: <NoData />,
          }}
          {...rest}
          pagination={false}
        />
      </div>

      {showPagination && (
        <Pagination
          align="end"
          className="p-5"
          showTotal={(total, range) => (
            <p className="flex items-center h-full text-sm text-gray-400">
              {range[1]} {t("pagination.of")} {total}
            </p>
          )}
          {...paginationOptions}
        />
      )}
    </div>
  );
};

export default memo(TableCore);
