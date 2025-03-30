import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
// Antd
import { message } from "antd";

// React icon
import { HiMenuAlt2 } from "react-icons/hi";
import { MdOutlineClose } from "react-icons/md";

import { useAppDispatch } from "~/store/hooks";

// style navbar
import "./Navbar.scss";

import { getAuthToken, removeAuthToken } from "~/helper/auth";
import { logoutUser } from "~/store/slice/user";
import MESSAGE_ERROR from "~/common/errorMessage";
import { DropdownMenu, MobileMenu, Notification } from "./components";
import apiAuthService from "~/api-client/auth";

interface INavbarMobile {
  key: string;
  label: string;
  path?: string;
  locale?: string;
  icon?: JSX.Element;
  children?: INavbarMobile[];
}

let timmerNavbarMobile: NodeJS.Timeout;

const Navbar = () => {
  const { t: tError, i18n } = useTranslation("Error");

  const dispatch = useAppDispatch();

  const [itemsShowMobile, setItemsShowMobile] = useState<INavbarMobile[][]>([]);

  const [showNavbarMobile, setShowNavbarMobile] = useState<boolean>(false);

  const onShowNavbarMobile = () => {
    if (timmerNavbarMobile) {
      clearTimeout(timmerNavbarMobile);
    }

    if (showNavbarMobile) {
      timmerNavbarMobile = setTimeout(() => {
        setItemsShowMobile([itemsShowMobile[0]]);
      }, 300);
    }

    setShowNavbarMobile(!showNavbarMobile);
  };

  const onLogout = async () => {
    const accessToken: string = getAuthToken("accessToken") as string;

    if (!accessToken) {
      message.error("Vui lòng thử lại");
      return;
    }

    try {
      await apiAuthService.logout();
    } catch (err) {
      message.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    removeAuthToken();
    dispatch(logoutUser());
  };

  useEffect(() => {
    return () => {
      if (timmerNavbarMobile) {
        clearTimeout(timmerNavbarMobile);
      }
    };
  }, [i18n.resolvedLanguage]);

  return (
    <div
      className={clsx(
        "sticky top-0 left-0 right-0 shadow-md transition-all ease-linear duration-100 z-[99]",
        "bg-white dark:bg-[#121212]",
      )}
    >
      <nav className="container__cus flex items-center justify-end py-2">
        <div className="flex items-center h-[60px] gap-5">
          {/* Drop down menu */}
          <Notification />

          <DropdownMenu onLogout={onLogout} />

          <button className="md:hidden block " onClick={onShowNavbarMobile}>
            {!showNavbarMobile && (
              <HiMenuAlt2 className="text-3xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
            )}
            {showNavbarMobile && (
              <MdOutlineClose className="text-3xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
            )}
          </button>
        </div>
        <MobileMenu
          showNavbarMobile={showNavbarMobile}
          onShowNavbarMobile={onShowNavbarMobile}
          onLogout={onLogout}
        />
      </nav>
    </div>
  );
};

export default Navbar;
