import { useTranslation } from "react-i18next";

import { MainLayout } from "~/layout";
import { PermissionWrap } from "./components";
import BlockerRouter from "~/components/BlockerRouter";

const PermissionPage = () => {
  const { t } = useTranslation("PermissionPage");

  return (
    <MainLayout
      titleText={t("title")}
      listBreadcrumb={[{ title: t("breadcrumb.list") }]}
    >
      <BlockerRouter>
        <PermissionWrap />
      </BlockerRouter>
    </MainLayout>
  );
};

export default PermissionPage;
