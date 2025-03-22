import { useCallback, useEffect, useState } from "react";
import { RoleGroupManage, RoleManage, TreePermissionManage } from "./index";
import { IRole, IRoleItem } from "~/interface/role";
import { getRoles } from "~/api-client/role";
import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";
import { useTranslation } from "react-i18next";
import MESSAGE_ERROR from "~/common/error";

const PermissionWrap = () => {
  const { messageAntd } = useMessageAntd();
  const { t: tError } = useTranslation("Error");

  const [selectedGroupItem, setSelectedGroupItem] = useState<string | null>(
    null,
  );
  const [selectedRoleItem, setSelectedRoleItem] = useState<string | null>(null);

  const [selectPermission, setSelectPermission] = useState<string[] | null>(
    null,
  );

  const [roles, setRoles] = useState<IRoleItem[]>([]);

  const [listRole, setListRole] = useState<IRole[]>([]);

  const onSelectGroupItem = useCallback(
    (id: string) => {
      setSelectedGroupItem(id);
      setSelectPermission(null);
      setSelectedRoleItem(null);
    },
    [selectedGroupItem],
  );

  const onSelectRoleItem = (id: string | null, permissions: string[]) => {
    if (!id) {
      setSelectPermission(null);
      setSelectedRoleItem(null);
      return;
    }

    setSelectPermission(permissions);
    setSelectedRoleItem(id);
  };

  const handleGetRoles = async (groupId: string) => {
    await getRoles({ groupId })
      .then((payload: IRole[]) => {
        const data: IRoleItem[] = payload.map((item: IRole) => ({
          id: item._id,
          name: item.name,
        }));

        setRoles(data);
        setListRole(payload);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        if (statusCode === 403) {
          messageAntd.error(tError(MESSAGE_ERROR.FORBIDDEN));
        } else {
          messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
        }
      });
  };

  useEffect(() => {
    if (!selectedGroupItem) {
      setRoles([]);
      setListRole([]);
      // reset();
      return;
    }

    handleGetRoles(selectedGroupItem);
    // setValue("groupId", selectedGroup);
  }, [selectedGroupItem]);

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 justify-between py-8 gap-10">
      {/* Group role */}
      <RoleGroupManage
        selectedValue={selectedGroupItem}
        onSelectValue={onSelectGroupItem}
      />

      {/* Role */}
      <RoleManage
        selectedGroup={selectedGroupItem}
        selectedValue={selectedRoleItem}
        roles={roles}
        listRole={listRole}
        onSelectValue={onSelectRoleItem}
        handleGetRoles={() => handleGetRoles(selectedGroupItem)}
      />

      {/* Permission */}
      <TreePermissionManage
        selectRole={selectedRoleItem}
        selectPermission={selectPermission}
        handleGetRoles={() => handleGetRoles(selectedGroupItem)}
      />
    </div>
  );
};

export default PermissionWrap;
