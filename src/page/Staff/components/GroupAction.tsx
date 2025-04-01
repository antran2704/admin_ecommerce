import { Dropdown, MenuProps, UploadFile as UploadFileType } from "antd";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import clsx from "clsx";

import { BtnAdd, BtnExportFile, BtnImportFile } from "~/components/Button";
import PDFManager from "~/components/Pdf";
import PDFRow from "~/components/Pdf/Row";
import PDFText from "~/components/Pdf/Text";

import { DAY_DMY } from "~/common/format";
import { createExcelFile, handleGetDataFromExcel } from "~/helper/file";
import { ModalAlert } from "~/components/Modal";
import { UploadFile } from "~/components/Core";
import { ETypeFile } from "~/enum/file";
import useMessageAntd from "~/hooks/useMessageAntd";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";
import { combinePhoneNumber } from "~/helper/phoneNumber";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { ICreateStaffBatch, IStaffResponse, IStaffTable } from "../interfaces";
import { ENUM_ACCOUNT_STATUS } from "~/enum/user";
import PATH_NAME from "~/routes/paths";

interface Props {
  data: IStaffTable[];
  handleGetData: () => void;
}

const GroupAction = (props: Props) => {
  const { data = [], handleGetData } = props;

  const { t } = useTranslation("StaffPage");
  const { t: tCommon, i18n } = useTranslation("Common");
  const { t: tSuccess } = useTranslation("Success");
  const { t: tError } = useTranslation("Error");

  const { messageAntd } = useMessageAntd();

  const [listCreateStaff, setListCreateStaff] = useState<ICreateStaffBatch[]>(
    [],
  );
  const [file, setFile] = useState<UploadFileType | null>(null);

  const [messageFile, setMessageFile] = useState<string | null>(null);

  const [modal, setModal] = useState<{ pdf: boolean; importFile: boolean }>({
    pdf: false,
    importFile: false,
  });
  const [loading, setLoading] = useState<{ submit: boolean }>({
    submit: false,
  });

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const handleResetUploadFile = () => {
    setFile(null);
    setListCreateStaff([]);
    setMessageFile(null);
  };

  const onExportExcel = useCallback(() => {
    const dataParse: Partial<IStaffTable>[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      groupRole: item.groupRole,
      role: item.role,
      status: item.status,
      createdAt: dayjs(item.createdAt).format(DAY_DMY),
    }));

    createExcelFile<Partial<IStaffTable>>(
      dataParse,
      "Danh_sach_nhan_vien",
      "Danh_sach_nhan_vien",
      [
        {
          header: t("table.id"),
          key: "id",
          width: 20,
        },
        { header: t("table.name"), key: "name", width: 20 },
        { header: t("table.email"), key: "email", width: 20 },
        { header: t("table.groupRole"), key: "groupRole", width: 20 },
        { header: t("table.role"), key: "role", width: 20 },
        { header: t("table.status"), key: "status", width: 20 },
        { header: t("table.createdAt"), key: "createdAt", width: 20 },
      ],
    );
  }, [data, i18n.resolvedLanguage]);

  const onExportTemplate = useCallback(() => {
    createExcelFile<Partial<IStaffTable>>(
      [
        {
          name: "",
          email: "",
          role: "",
          groupRole: "",
          status: "" as ENUM_ACCOUNT_STATUS,
        },
      ],
      "Template_nhan_vien",
      "Template_nhan_vien",
      [
        { header: t("form.name"), key: "name", width: 20 },
        { header: t("form.email"), key: "email", width: 20 },
        { header: t("form.phone"), key: "phone", width: 20 },
        { header: t("form.dateOfBirth"), key: "dateOfBirth", width: 20 },
        {
          header: t("form.address"),
          key: "address",
          width: 20,
        },
        { header: t("form.startedAt"), key: "startedAt", width: 20 },
        { header: t("form.endedAt"), key: "endedAt", width: 20 },
        {
          header: t("form.userType"),
          key: "userType",
          width: 20,
        },
      ],
      {
        requireHeaders: [t("form.name"), t("form.email")],
      },
    );
  }, [data, i18n.resolvedLanguage]);

  const onImportFile = (file: UploadFileType | null) => {
    if (messageFile) {
      setMessageFile(null);
    }

    handleGetDataFromExcel<ICreateStaffBatch>(
      file.originFileObj,
      [
        "fullName",
        "email",
        "phoneNumber",
        "dateOfBirth",
        "address",
        "startDate",
        "endDate",
        "clientId",
      ],
      ["fullName", "email"],
      (data, isValid) => {
        if (!isValid || !data.length) {
          setMessageFile(tError(MESSAGE_ERROR.INVALID_FILE_FORMAT));
          setListCreateStaff([]);
          return;
        }

        const dataParse: ICreateStaffBatch[] = data.map((item) => {
          const itemParse: ICreateStaffBatch = {
            email: item.email,
            fullName: item.fullName,
          };

          if (item.dateOfBirth && dayjs(item.dateOfBirth).isValid()) {
            itemParse.dateOfBirth = new Date(item.dateOfBirth).toISOString();
          }

          if (item.startDate && dayjs(item.startDate).isValid()) {
            itemParse.startDate = new Date(item.startDate).toISOString();
          }

          if (item.endDate && dayjs(item.endDate).isValid()) {
            itemParse.endDate = new Date(item.endDate).toISOString();
          }

          if (item.phoneNumber) {
            itemParse.phoneNumber = combinePhoneNumber(
              "84",
              item.phoneNumber.toString(),
            );
          }

          if (item.address) {
            itemParse.address = item.address;
          }

          if (item.clientId) {
            itemParse.clientId = item.clientId;
          }

          return itemParse;
        });

        setListCreateStaff(dataParse);
      },
    );

    setFile(file);
  };

  const onSubmit = async () => {
    if (!listCreateStaff.length || messageFile) return;

    onLoading("submit", true);

    try {
      // await createStaffBatch(listCreateStaff);
      handleResetUploadFile();
      handleGetData();
      onModal("importFile", false);
      messageAntd.success(tSuccess("create"));
    } catch (err) {
      const { message, statusCode } = hanldeErrorAxios(err);

      if (statusCode === 400 && message === "ADMIN_IS_EXISTED") {
        messageAntd.error(tError(message));
      } else {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      }
    }

    onLoading("submit", false);
  };

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
      // {
      //   label: (
      //     <BtnExportFile
      //       size="middle"
      //       type="link"
      //       onClick={onExportTemplate}
      //       className="text-gray-700 w-full justify-start"
      //       classNames={{ icon: "!text-gray-700" }}
      //     >
      //       {tCommon("file.exportTemplate")}
      //     </BtnExportFile>
      //   ),
      //   key: "3",
      // },
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
        <BtnImportFile
          onClick={() => onModal("importFile", true)}
          className="font-semibold"
        >
          {tCommon("file.importFile")}
        </BtnImportFile>

        {/* Show PDF */}
        <PDFManager
          show={modal.pdf}
          header={[
            t("table.id"),
            t("table.name"),
            t("table.email"),
            t("table.groupRole"),
            t("table.role"),
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
                value={item.groupRole}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
              />
              <PDFText
                value={item.role}
                style={{ width: "calc(100% / 7)%", textAlign: "center" }}
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

        {ability.can(
          EPermisisonAction.CREATE,
          EPageRole.ADMIN_STAFF,
        ) && (
          <Link to={PATH_NAME.CREATE_USER}>
            <BtnAdd className="font-semibold">{tCommon("create")}</BtnAdd>
          </Link>
        )}
      </div>

      <ModalAlert
        title={t("modalUploadFile.title")}
        open={modal.importFile}
        onCancel={() => {
          if (!loading.submit) {
            onModal("importFile", false);
            handleResetUploadFile();
          }
        }}
        alignBottom="right"
        okButtonProps={{
          loading: loading.submit,
          disabled: loading.submit || !listCreateStaff.length,
        }}
        onOk={onSubmit}
      >
        <div className="py-5">
          <UploadFile
            data={file ? [file] : []}
            rules={[ETypeFile.EXCEL]}
            onChangeFile={onImportFile}
            onRemoveFile={() => {
              setFile(null);
              setListCreateStaff([]);
              setMessageFile(null);
            }}
            content={
              <div
                className={clsx("w-full py-5 cursor-pointer", [
                  file && "hidden",
                ])}
              >
                <p className="text-sm text-center text-gray-700">
                  {t("modalUploadFile.description1")}
                </p>
                <p className="text-sm text-center text-gray-400 mt-2">
                  {t("modalUploadFile.description2")}{" "}
                  <span className="text-green-500">.xlsx</span>
                </p>
              </div>
            }
            className="bg-gray-100"
            errorMessage={messageFile}
            error={!!messageFile}
          />
        </div>
      </ModalAlert>
    </Fragment>
  );
};

export default GroupAction;
