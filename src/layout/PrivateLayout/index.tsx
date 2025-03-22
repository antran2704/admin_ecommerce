import clsx from "clsx";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";

import LeftMenu from "~/components/LeftMenu";
import SpinnerLoading from "~/components/Loading/Spinner";
import Navbar from "~/components/Navbar";
import {
  injectNavigate,
  injectStore,
  injectTranslate,
} from "~/config/axiosClient";
import { checkDarkMode } from "~/helper/darkmode";
import { useAppDispatch } from "~/store/hooks";

const PrivateLayout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("Error");

  useEffect(() => {
    checkDarkMode();
    injectStore(dispatch);
    injectNavigate(navigate as any);
    injectTranslate(t);
  }, []);

  return (
    <div className="flex bg-neutral-100 dark:bg-slate-800">
      <LeftMenu />

      <div
        className={clsx(
          "min-h-screen w-full transition-all ease-linear duration-100",
        )}
      >
        <Navbar />

        <div
          className={clsx(
            "relative 2xl:w-[93%] xl:w-[90%] w-full min-h-screen ml-auto",
          )}
        >
          <Suspense
            fallback={
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-10">
                <SpinnerLoading size="L" />
              </div>
            }
          >
            <div className={clsx("w-full mx-auto h-full px-5 lg:py-5 py-10")}>
              <Outlet />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
