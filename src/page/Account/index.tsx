import { MainLayout } from "~/layout";
import { InfoUser, SidebarAccount } from "./components";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const AccountPage = () => {
  const { t } = useTranslation("AccountPage");

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("title")}
      className="bg-white"
      listBreadcrumb={[
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
        <div className="mx-auto">
          {/* Side bar */}
          <SidebarAccount isEdit={isEdit} />
        </div>

        {/* Content */}
        <div className="xl:w-10/12 w-full px-5">
          <InfoUser isEdit={isEdit} onEdit={onEdit} />
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountPage;
