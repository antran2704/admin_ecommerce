import { useEffect, useState } from "react";
import { apiGroupRoleService } from "~/api-client/role/groupRole";
import { ISearch } from "~/interface";
import { IGroupRoleResponse } from "~/page/Permission/interfaces";

const useGroupRoles = (query?: ISearch) => {
  const [groupRoles, setGroupRoles] = useState<IGroupRoleResponse[]>([]);

  const handleGetGroupRoles = async (paramater: ISearch) => {
    await apiGroupRoleService
      .roleGroups(paramater)
      .then((res: IGroupRoleResponse[]) => setGroupRoles(res))
      .catch((err) => err);
  };

  useEffect(() => {
    handleGetGroupRoles(query);
  }, [query]);

  return { groupRoles, handleGetGroupRoles };
};

export default useGroupRoles;
