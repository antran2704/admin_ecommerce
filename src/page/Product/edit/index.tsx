import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { TabsProps } from "antd";

import { MainLayout } from "~/layout";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import PATH_NAME from "~/routes/paths";

import { TabsCore } from "~/components/Core";
import { parseQueryString } from "~/helper/url";
import EditForm from "../components/EditForm";

const EditPage = () => {
  const { t, i18n } = useTranslation("ProductPage");

  const { edit: editParam, tab: tabParam } = useGetSearchParams<{
    edit: string;
    tab: string;
  }>({
    edit: "string",
    tab: "string",
  });

  const { product_id } = useParams();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const onTabChange = (key: string) => {
    navigate(pathname + parseQueryString({ tab: key }));
  };

  const tabs: TabsProps["items"] = useMemo((): TabsProps["items"] => {
    return [
      {
        key: "detail",
        label: t("tabs.detail"),
        children: <EditForm isEdit={isEdit} onEdit={onEdit} />,
      },
      {
        key: "variant-product",
        label: t("tabs.variantProduct"),
        // children: <VariantTypeValueManage variantTypeId={variant_type_id} />,
      },
    ];
  }, [i18n.resolvedLanguage, isEdit]);

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl={PATH_NAME.PRODUCTS}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.PRODUCTS },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      {/* Form */}
      <div className="w-full p-5">
        <TabsCore
          activeKey={tabParam ? (tabParam as string) : "detail"}
          items={tabs}
          onChange={onTabChange}
        />
      </div>
    </MainLayout>
  );
};

export default EditPage;
