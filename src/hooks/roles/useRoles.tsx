import { useEffect, useState } from "react";
import apiRoleService from "~/api-client/role/role";
import { IRoleResponse, IGetRolesRequest } from "~/page/Permission/interfaces";

const useRoles = (query?: IGetRolesRequest) => {
  const [roles, setRoles] = useState<IRoleResponse[]>([]);
  const [paramater, setParameter] = useState<IGetRolesRequest>({ ...query });

  const handleGetRoles = async (paramater: IGetRolesRequest) => {
    await apiRoleService.getRoles(paramater)
      .then((res: IRoleResponse[]) => setRoles(res))
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater.groupRoleId) return;

    handleGetRoles(paramater);
  }, [paramater]);

  return { roles, setParameterRole: setParameter, handleGetRoles };
};

export default useRoles;
