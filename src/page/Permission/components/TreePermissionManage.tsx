import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import clsx from "clsx";

import NotFoundImage from "@assets/images/PermissionPage/not_found.png";
import TreePermission from "./TreePermission";
import { ModalAlert } from "~/components/Modal";
import useBlockerRouter from "~/hooks/useBlockerRouter";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { apiPermissionService } from "~/api-client/role/permission";
import MESSAGE_SUCCESS from "~/common/successMessage";

interface Props {
  selectRole?: string | null;
  selectPermission: string[] | null;
  handleGetRoles: () => Promise<void>;
}

const TreePermissionManage = (props: Props) => {
  const { selectPermission, selectRole, handleGetRoles } = props;

  const { t } = useTranslation("PermissionPage");
  const { t: tCommon } = useTranslation("Common");
  const { t: tSuccess } = useTranslation("Success");
  const { t: tError } = useTranslation("Error");

  const { onBlockerRouter } = useBlockerRouter();

  const [permissions, setPermissions] = useState<string[]>([]);

  const [modal, setModal] = useState<{ update: boolean }>({ update: false });
  const [loading, setLoading] = useState<{ update: boolean }>({
    update: false,
  });

  const { messageAntd } = useMessageAntd();

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const onChangePermission = (values: string[]) => {
    setPermissions(values);
    onBlockerRouter(true);
  };

  const handleUpdatePermission = async (roleId: string, values: string[]) => {
    if (!roleId) return;
    const parseValues = values.filter((item) => item.includes("."));

    onLoading("update", true);

    await apiPermissionService
      .update(selectRole, { permissions: parseValues })
      .then(() => {
        handleGetRoles();
        onModal("update", false);
        onBlockerRouter(false);
        messageAntd.success(tSuccess(MESSAGE_SUCCESS.UPDATED));
      })
      .catch(() => {
        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      });

    onLoading("update", false);
  };

  useEffect(() => {
    setPermissions(selectPermission || []);
  }, [selectPermission]);

  return (
    <div
      className={clsx("px-5 pb-5 bg-white rounded-lg", [
        selectRole ? "pt-5" : "pt-8",
      ])}
    >
      <div className="flex items-center justify-between pb-2 border-b border-b-gray-200/50">
        <h2 className="md:text-lg text-base font-medium text-primary-color px-2">
          {t("feature")}
        </h2>

        {selectRole &&
          ability.can(EPermisisonAction.UPDATE, EPageRole.ADMIN_ROLE) && (
            <Button
              onClick={() => onModal("update", true)}
              className="min-w-[100px]"
              size="large"
              type="primary"
            >
              {tCommon("save")}
            </Button>
          )}
      </div>

      <ul className="scroll pt-5 xl:h-[500px] h-[400px]  overflow-y-auto">
        {!selectPermission && (
          <li className="flex flex-col items-center py-2 px-10 justify-center gap-5">
            <img
              src={NotFoundImage}
              alt="Not found permission"
              title="Not found permission"
              className="object-contain w-[200px]"
            />
            <p className="lg:w-3/4 w-full md:text-base text-sm font-medium text-gray-700 text-center">
              {t("notFoundPermission")}
            </p>
          </li>
        )}
        {selectPermission && (
          <TreePermission
            ability={{
              update: ability.can(
                EPermisisonAction.UPDATE,
                EPageRole.ADMIN_ROLE,
              ),
            }}
            data={selectPermission}
            onChange={onChangePermission}
          />
        )}
      </ul>

      <ModalAlert
        title={t("modalUpdatePermission.title")}
        open={modal.update}
        onOk={() => handleUpdatePermission(selectRole, permissions)}
        onCancel={() => onModal("update", false)}
        okButtonProps={{
          loading: loading.update,
          disabled: loading.update,
        }}
      >
        <p className="text-base text-center">
          {t("modalUpdatePermission.description")}
        </p>
      </ModalAlert>
    </div>
  );
};

export default TreePermissionManage;
