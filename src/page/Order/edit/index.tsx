import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { MainLayout } from "~/layout";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import useMessageAntd from "~/hooks/useMessageAntd";
import { FormFooter } from "~/components/Footer";
import PATH_NAME from "~/routes/paths";
import {
  OrderCancellations,
  OrderCustomerInfo,
  OrderCustomerInfoSkelaton,
  OrderHeader,
  OrderHeaderSkelaton,
  OrderItemList,
  OrderPaymentSummary,
} from "../components";
import { useOrder } from "../hooks";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import MESSAGE_ERROR from "~/common/errorMessage";

const EditPage = () => {
  const { t } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");

  const { order_id } = useParams();
  const { edit: editParam } = useGetSearchParams<{
    edit: string;
  }>({
    edit: "string",
  });

  const navigate = useNavigate();

  const { data: orderData, isLoading, error, isError } = useOrder(order_id);
  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const { messageAntd } = useMessageAntd();

  useEffect(() => {
    if (!isError) return;

    const { statusCode } = hanldeErrorAxios(error);

    if (statusCode === 404) {
      messageAntd.error(t("error.ORDER_NOT_FOUND"));
      navigate(PATH_NAME.ORDERS);
    } else {
      messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }
  }, [error, isError]);

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl={PATH_NAME.ORDERS}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.ORDERS },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      <div className="flex flex-col p-6 gap-6">
        {isLoading && <OrderHeaderSkelaton />}
        {!isLoading && <OrderHeader order={orderData} isEditable={isEdit} />}

        <div className="flex flex-col-reverse lg:flex-row overflow-hidden gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {orderData && !!orderData.cancellations?.length && (
              <OrderCancellations order={orderData} />
            )}

            <OrderItemList />

            <OrderPaymentSummary order={orderData} />

            {/* <OrderActivities /> */}
          </div>

          {/* Right Section: Customer Details */}
          {isLoading && <OrderCustomerInfoSkelaton />}
          {!isLoading && <OrderCustomerInfo order={orderData} />}
        </div>
      </div>
      {isEdit && (
        <FormFooter
          okText={tCommon("save")}
          cancelText={tCommon("cancel")}
          onCancel={onEdit}
        />
      )}

      {!isEdit && (
        <FormFooter
          okText={tCommon("update")}
          cancelText={tCommon("cancel")}
          onOk={onEdit}
          onCancel={() => navigate(PATH_NAME.ORDERS)}
          okProps={
            {
              // className: !canEditForm(staffId, infoUser.userId) && "hidden",
            }
          }
        />
      )}
    </MainLayout>
  );
};

export default EditPage;
