import { useState } from "react";

function useSelectTableRows<T>() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  const onSelectedRowKeys = (selected: React.Key[]) => {
    setSelectedRowKeys(selected);
  };

  const onSelectedRows = (selectedRows: T[]) => {
    setSelectedRows(selectedRows);
  };

  return { selectedRowKeys, selectedRows, onSelectedRowKeys, onSelectedRows };
}

export default useSelectTableRows;
