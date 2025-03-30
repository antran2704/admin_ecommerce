import { useCallback, useEffect, useState } from "react";
import { RoleGroupManage, RoleManage, TreePermissionManage } from "./index";
import { useTranslation } from "react-i18next";

import hanldeErrorAxios from "~/helper/handleErrorAxios";
import useMessageAntd from "~/hooks/useMessageAntd";
import MESSAGE_ERROR from "~/common/errorMessage";
import { IRoleResponse, IRoleItem } from "../interfaces";
import apiRoleService from "~/api-client/role/role";
import { IResponseDataWithPagination } from "~/interface";

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

  const [listRole, setListRole] = useState<IRoleResponse[]>([]);

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
    await apiRoleService.getRoles({ groupRoleId: groupId })
      .then((payload: IResponseDataWithPagination<IRoleResponse[]>) => {
        const data: IRoleItem[] = payload.data.map((item: IRoleResponse) => ({
          id: item.roleId,
          name: item.name,
        }));

        setRoles(data);
        setListRole(payload.data);
      })
      .catch((err) => {
        const { statusCode } = hanldeErrorAxios(err);

        messageAntd.error(tError(MESSAGE_ERROR.TRY_AGAIN));
      });
  };

  useEffect(() => {
    if (!selectedGroupItem) {
      setRoles([]);
      setListRole([]);
      return;
    }

    handleGetRoles(selectedGroupItem);
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
