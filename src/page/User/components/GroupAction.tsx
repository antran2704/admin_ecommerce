import { Dropdown, MenuProps } from "antd";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import { BtnAdd, BtnExportFile } from "~/components/Button";
import PDFManager from "~/components/Pdf";
import PDFRow from "~/components/Pdf/Row";
import PDFText from "~/components/Pdf/Text";

import { DAY_DMY } from "~/common/format";
import { createExcelFile } from "~/helper/file";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { IUserTable } from "../interfaces";
import PATH_NAME from "~/routes/paths";

interface Props {
  data: IUserTable[];
}

const GroupAction = (props: Props) => {
  const { data = [] } = props;

  const { t } = useTranslation("UserPage");
  const { t: tCommon, i18n } = useTranslation("Common");

  const [modal, setModal] = useState<{ pdf: boolean }>({
    pdf: false,
  });

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onExportExcel = useCallback(() => {
    const dataParse: Partial<IUserTable>[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      status: item.status,
      createdAt: dayjs(item.createdAt).format(DAY_DMY),
    }));

    createExcelFile<Partial<IUserTable>>(
      dataParse,
      "Danh_sach_nguoi_dung",
      "Danh_sach_nguoi_dung",
      [
        {
          header: t("table.id"),
          key: "id",
          width: 20,
        },
        { header: t("table.name"), key: "name", width: 20 },
        { header: t("table.email"), key: "email", width: 20 },
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
      {
        type: "divider",
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
            t("table.email"),
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
              <PDFText value={item.id} style={{ width: "calc(100% / 7)%" }} />
              <PDFText value={item.name} style={{ width: "calc(100% / 7)%" }} />
              <PDFText
                value={item.email}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={item.status}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
              <PDFText
                value={dayjs(item.createdAt).format(DAY_DMY)}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
            </PDFRow>
          ))}
        </PDFManager>

        {ability.can(EPermisisonAction.CREATE, EPageRole.ADMIN_USER) && (
          <Link to={PATH_NAME.CREATE_USER}>
            <BtnAdd className="font-semibold">{tCommon("create")}</BtnAdd>
          </Link>
        )}
      </div>
    </Fragment>
  );
};

export default GroupAction;
