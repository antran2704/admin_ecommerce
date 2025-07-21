import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TabsProps } from "antd";

import { LoadingLayout, MainLayout } from "~/layout";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import PATH_NAME from "~/routes/paths";

import { TabsCore } from "~/components/Core";
import { parseQueryString } from "~/helper/url";
import EditForm from "../components/EditForm";
import VariantProductManage from "../../VariantProduct/components/VariantProductManage";
import { IProductResponse } from "../interfaces/productResponse.interface";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import { apiProductService } from "~/api-client/product";
import useMessageAntd from "~/hooks/useMessageAntd";
import useLoading from "~/hooks/useLoading";
import { UpdateProductProvider } from "../contexts";

const EditPage = () => {
  const { t } = useTranslation("ProductPage");

  const { edit: editParam, tab: tabParam } = useGetSearchParams<{
    edit: string;
    tab: string;
  }>({
    edit: "string",
    tab: "string",
  });

  const { product_id } = useParams();
  const { messageAntd } = useMessageAntd();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);
  const [data, setData] = useState<IProductResponse | null>(null);

  const { loading, onLoading } = useLoading({ getData: true });

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const onTabChange = (key: string) => {
    navigate(pathname + parseQueryString({ tab: key }));
  };

  const handleGetData = async (id: string) => {
    onLoading({ getData: true });

    await apiProductService
      .product(id)
      .then((payload: IProductResponse) => {
        setData(payload);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 404) {
          messageAntd.error(t("error.PRODUCT_NOT_FOUND"));
          navigate(PATH_NAME.PRODUCTS);
        }
      });

    onLoading({ getData: false });
  };

  const tabs: TabsProps["items"] = [
    {
      key: "detail",
      label: t("tabs.detail"),
      children: <EditForm isEdit={isEdit} onEdit={onEdit} />,
    },
    {
      key: "variant-product",
      label: t("tabs.variantProduct"),
      children: <VariantProductManage />,
    },
  ];

  useEffect(() => {
    if (!product_id) return;

    handleGetData(product_id);
  }, [product_id]);

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
      <UpdateProductProvider value={{ product: data, setProduct: setData }}>
        <LoadingLayout loading={loading.getData}>
          <div className="w-full p-5">
            <TabsCore
              activeKey={tabParam ? (tabParam as string) : "detail"}
              items={tabs}
              onChange={onTabChange}
            />
          </div>
        </LoadingLayout>
      </UpdateProductProvider>
    </MainLayout>
  );
};

export default EditPage;
