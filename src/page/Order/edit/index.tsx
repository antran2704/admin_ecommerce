import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { MainLayout } from "~/layout";
import useGetSearchParams from "~/hooks/useGetSearchParams";
import useMessageAntd from "~/hooks/useMessageAntd";
import { ModalConfirm } from "~/components/Modal";
import { FormFooter } from "~/components/Footer";
import PATH_NAME from "~/routes/paths";
import { EditContent } from "../components/EditContent";

const EditPage = () => {
  const { t } = useTranslation("OrderPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { order_id } = useParams();
  const { edit: editParam } = useGetSearchParams<{
    edit: string;
  }>({
    edit: "string",
  });

  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState<boolean>(editParam ? true : false);

  const onEdit = () => {
    setIsEdit(!isEdit);
  };

  const { messageAntd } = useMessageAntd();

  return (
    <MainLayout
      titleText={isEdit ? t("editTitle") : t("viewInfoTitle")}
      className="bg-white"
      backUrl={PATH_NAME.CATEGORIES}
      listBreadcrumb={[
        { title: t("breadcrumb.list"), href: PATH_NAME.CATEGORIES },
        { title: isEdit ? t("breadcrumb.update") : t("breadcrumb.viewInfo") },
      ]}
    >
      {/* Form */}
      <EditContent />

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
          onCancel={() => navigate(PATH_NAME.CATEGORIES)}
          okProps={
            {
              // className: !canEditForm(staffId, infoUser.userId) && "hidden",
            }
          }
        />
      )}

      {/* Modal Disable Collection */}
      {/* <ModalConfirm
        title={t("modalUpdate.title")}
        subtitle={t("modalUpdate.subtitle")}
        open={modal.submit}
        onCancel={() => {
          if (loading.submit) return;
          onModal("submit", false);
        }}
        onOk={form.handleSubmit(onSubmit)}
        okText={tCommon("confirm")}
        cancelText={tCommon("goBack")}
        destroyOnClose={true}
        cancelButtonProps={{
          disabled: loading.submit,
        }}
        okButtonProps={{
          loading: loading.submit,
          disabled: loading.submit,
        }}
      /> */}
    </MainLayout>
  );
};

export default EditPage;
