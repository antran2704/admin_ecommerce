import { useTranslation } from "react-i18next";
import { MainLayout } from "~/layout";
import { UpdateForm } from "../components";
import { useParams } from "react-router-dom";
import { useState } from "react";
import useGetSearchParams from "~/hooks/useGetSearchParams";

const EditStaff = () => {
  const { t } = useTranslation("StaffPage");

  const { staff_id } = useParams();
  const { edit: editParam } = useGetSearchParams<{
    edit: string;
  }>({
    edit: "string",
  });

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl="/staffs"
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: "/staffs" },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      <UpdateForm isEdit={isEdit} onEdit={onEdit} staffId={staff_id} />
    </MainLayout>
  );
};

export default EditStaff;
