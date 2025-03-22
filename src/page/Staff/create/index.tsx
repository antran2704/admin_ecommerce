import { useTranslation } from "react-i18next";
import { MainLayout } from "~/layout";
import { CreateForm } from "../components";

const CreateStaff = () => {
  const { t } = useTranslation("StaffPage");

  return (
    <MainLayout
      titleText={t("createTitle")}
      className="bg-white"
      backUrl="/staffs"
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: "/staffs" },
        { title: t("breadcrumb.create") },
      ]}
    >
      <CreateForm />
    </MainLayout>
  );
};

export default CreateStaff;
