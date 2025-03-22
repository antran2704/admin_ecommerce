import { useEffect, useState } from "react";
import { getRoles } from "~/api-client/role";
import { IRole, IRoleSearch } from "~/interface/role";

const useRoles = (query?: IRoleSearch) => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [paramater, setParameter] = useState<IRoleSearch>({ ...query });

  const handleGetRoles = async (paramater: IRoleSearch) => {
    await getRoles(paramater)
      .then((res: IRole[]) => setRoles(res))
      .catch((err) => err);
  };

  useEffect(() => {
    if (!paramater.groupId) return;

    handleGetRoles(paramater);
  }, [paramater]);

  return { roles, setParameterRole: setParameter, handleGetRoles };
};

export default useRoles;
