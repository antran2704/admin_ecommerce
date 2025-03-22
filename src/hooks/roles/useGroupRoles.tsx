import { useEffect, useState } from "react";
import { getRoleGroups } from "~/api-client/role/groupRole";
import { IGroupRole, IGroupRoleSearch } from "~/interface/role/group";

const useGroupRoles = (query?: IGroupRoleSearch) => {
  const [groupRoles, setGroupRoles] = useState<IGroupRole[]>([]);

  const handleGetGroupRoles = async (paramater: IGroupRoleSearch) => {
    await getRoleGroups(paramater)
      .then((res: IGroupRole[]) => setGroupRoles(res))
      .catch((err) => err);
  };

  useEffect(() => {
    handleGetGroupRoles(query);
  }, [query]);

  return { groupRoles, handleGetGroupRoles };
};

export default useGroupRoles;
