import { Dropdown, MenuProps } from "antd";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { BtnExportFile } from "~/components/Button";
import PDFManager from "~/components/Pdf";
import PDFRow from "~/components/Pdf/Row";
import PDFText from "~/components/Pdf/Text";

import { DAY_DMY } from "~/common/format";
import { createExcelFile } from "~/helper/file";
import { formatBigNumber } from "~/helper/format";
import { IOrderTable } from "../interfaces/orderTable.interface";

interface Props {
  data: IOrderTable[];
}

const GroupAction = (props: Props) => {
  const { data = [] } = props;

  const { t } = useTranslation("OrderPage");
  const { t: tCommon, i18n } = useTranslation("Common");

  const [modal, setModal] = useState<{ pdf: boolean }>({
    pdf: false,
  });

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onExportExcel = useCallback(() => {
    const dataParse: Partial<IOrderTable>[] = data.map((item) => ({
      id: item.id,
      customerName: item.customerName,
      phoneNumber: item.phoneNumber,
      totalPrice: item.totalPrice,
      status: item.status,
      createdAt: dayjs(item.createdAt).format(DAY_DMY),
    }));

    createExcelFile<Partial<IOrderTable>>(
      dataParse,
      "Danh_sach_don_hang",
      "Danh_sach_don_hang",
      [
        {
          header: t("table.id"),
          key: "id",
          width: 20,
        },
        { header: t("table.name"), key: "name", width: 20 },
        { header: t("table.phoneNumber"), key: "phoneNumber", width: 20 },
        { header: t("table.totalPrice"), key: "totalPrice", width: 20 },
        { header: t("table.status"), key: "status", width: 20 },
        { header: t("table.createdAt"), key: "createdAt", width: 20 },
      ],
    );
  }, [data, i18n.resolvedLanguage]);

  const items: MenuProps["items"] = useMemo(
    (): MenuProps["items"] => [
      {
        label: (
          <BtnExportFile
            onClick={onExportExcel}
            size="middle"
            type="link"
            className="text-gray-700 w-full justify-start"
          >
            {tCommon("file.exportExcel")}
          </BtnExportFile>
        ),
        key: "0",
      },
      {
        type: "divider",
      },
      {
        label: (
          <BtnExportFile
            size="middle"
            type="link"
            className="text-gray-700 w-full justify-start"
            onClick={() => onModal("pdf", true)}
            color="text-red-700"
          >
            {tCommon("file.exportPdf")}
          </BtnExportFile>
        ),
        key: "1",
      },
    ],
    [data, i18n.resolvedLanguage],
  );

  return (
    <Fragment>
      <div className="flex items-center gap-2">
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <div>
            <BtnExportFile className="font-semibold">
              {tCommon("file.exportFile")}
            </BtnExportFile>
          </div>
        </Dropdown>

        {/* Show PDF */}
        <PDFManager
          show={modal.pdf}
          header={[
            t("table.id"),
            t("table.name"),
            t("table.phoneNumber"),
            t("table.totalPrice"),
            t("table.status"),
            t("table.createdAt"),
          ].map((item, index) => (
            <PDFText
              key={index}
              value={item}
              style={{ width: "calc(100% / 7)%", textAlign: "center" }}
            />
          ))}
          onClose={() => onModal("pdf", false)}
        >
          {data.map((item, index) => (
            <PDFRow
              key={index}
              style={{ padding: "6 0", borderBottom: "1px solid #303032" }}
            >
              <PDFText
                value={item.id}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
              <PDFText
                value={item.customerName}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={item.phoneNumber}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={formatBigNumber(item.totalPrice)}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={item.status}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={dayjs(item.createdAt).format(DAY_DMY)}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
            </PDFRow>
          ))}
        </PDFManager>
      </div>
    </Fragment>
  );
};

export default GroupAction;
