import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ability, { setRules } from "~/context/ability";

import { getAuthToken, removeAuthToken } from "~/helper/auth";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  fetchUserAsyncThunk,
  selectUserSlice,
  updatePermission,
} from "~/store/slice/user";
import SpinnerLoading from "../Loading/Spinner";
import { AbilityContextProvider } from "~/context/can";
import { IAddRule } from "~/interface/permission";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import apiMeService from "~/api-client/me";
import hanldeErrorAxios from "~/helper/handleErrorAxios";

const AuthenGuard = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { infoUser } = useAppSelector(selectUserSlice);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(!infoUser.userId);

  const handleSetupPermission = async (isAdmin: boolean = false) => {
    if (isAdmin) {
      const rules = setRules([
        {
          action:
            EPermisisonAction.MANAGE.toLocaleLowerCase() as EPermisisonAction,
          subject: EPageRole.ALL.toLocaleLowerCase() as EPageRole,
        },
      ]).rules;
      ability.update(rules);
      dispatch(updatePermission(["ALL"]));
      return;
    }

    const { permissions } = await apiMeService.getPermissions();
    const formatRules: IAddRule[] = permissions.map((item) => {
      const [subject, action] = item.split(".");

      return {
        action: action as EPermisisonAction,
        subject: subject as EPageRole,
      };
    });

    const rules = setRules(formatRules).rules;
    ability.update(rules);
    dispatch(updatePermission(permissions));
  };

  const chechAuth = async () => {
    setLoading(true);

    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(fetchUserAsyncThunk()).unwrap();
      setLoading(false);
    } catch (error) {
      const { message } = hanldeErrorAxios(error);
      if(message === "USER_WAS_DISABLED" || message === "USER_NOT_FOUND") {
        removeAuthToken();
      }

      navigate("/login");
    }
  };

  useEffect(() => {
    if (!infoUser.userId) {
      chechAuth();
    }

    if (infoUser.userId) {
      handleSetupPermission(infoUser.isAdmin);
    }
  }, [infoUser]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-[9999]">
        <SpinnerLoading size="L" />
      </div>
    );
  }

  return (
    <AbilityContextProvider value={ability}>{children}</AbilityContextProvider>
  );
};

export default AuthenGuard;
