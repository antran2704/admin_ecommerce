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
import PATH_NAME from "~/routes/paths";
import { IVariantTypeTable } from "../interfaces";

interface Props {
  data: IVariantTypeTable[];
}

const GroupAction = (props: Props) => {
  const { data = [] } = props;

  const { t } = useTranslation("VariantTypePage");
  const { t: tCommon, i18n } = useTranslation("Common");

  const [modal, setModal] = useState<{ pdf: boolean }>({
    pdf: false,
  });

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onExportExcel = useCallback(() => {
    const dataParse: Partial<IVariantTypeTable>[] = data.map((item) => ({
      id: item.id,
      title: item.title,
      createdAt: dayjs(item.createdAt).format(DAY_DMY),
    }));

    createExcelFile<Partial<IVariantTypeTable>>(
      dataParse,
      "Danh_sach_bien_the",
      "Danh_sach_bien_the",
      [
        {
          header: t("table.id"),
          key: "id",
          width: 20,
        },
        { header: t("table.name"), key: "name", width: 20 },
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
          header={[t("table.id"), t("table.name"), t("table.createdAt")].map(
            (item, index) => (
              <PDFText
                key={index}
                value={item}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
            ),
          )}
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
                value={item.title}
                style={{ width: "calc(100% / 7)%" }}
              />
              <PDFText
                value={dayjs(item.createdAt).format(DAY_DMY)}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
            </PDFRow>
          ))}
        </PDFManager>

        {ability.can(
          EPermisisonAction.CREATE,
          EPageRole.ADMIN_VARIANT_TYPE,
        ) && (
          <Link to={PATH_NAME.CREATE_VARIANT_TYPE}>
            <BtnAdd className="font-semibold">{tCommon("create")}</BtnAdd>
          </Link>
        )}
      </div>
    </Fragment>
  );
};

export default GroupAction;
