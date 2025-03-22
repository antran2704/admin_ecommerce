import { Switch } from "antd";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaRegHandshake, FaRegUser } from "react-icons/fa";
import { IoMoonOutline } from "react-icons/io5";
import { LuPencilRuler } from "react-icons/lu";
import {
  MdLogout,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleChangeMode } from "~/helper/darkmode";
import { useAppSelector } from "~/store/hooks";

interface INavbarMobile {
  key: string;
  label: string;
  path?: string;
  locale?: string;
  icon?: JSX.Element;
  children?: INavbarMobile[];
}

interface Props {
  showNavbarMobile: boolean;
  onLogout: () => void;
  onShowNavbarMobile: () => void;
}

const MobileMenu = (props: Props) => {
  const { showNavbarMobile, onShowNavbarMobile, onLogout } = props;

  const { t, i18n } = useTranslation("Navbar");

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { infoUser } = useAppSelector((state) => state.user);

  const [itemsShowMobile, setItemsShowMobile] = useState<INavbarMobile[][]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark" ? true : false,
  );

  const onBackItemMobile = () => {
    if (itemsShowMobile.length <= 1) return;

    itemsShowMobile.splice(itemsShowMobile.length - 1, 1);

    setItemsShowMobile([...itemsShowMobile]);
  };

  const onClickItemMobile = (item: INavbarMobile) => {
    if (item.children && item.children.length) {
      setItemsShowMobile([...itemsShowMobile, item.children]);
      return;
    }
    if (item.key.includes("language") && item.path) {
      i18n.changeLanguage(item.locale);
      onShowNavbarMobile();
      return;
    }

    if (item.path && item.locale) {
      navigate(item.path);
      onShowNavbarMobile();
      return;
    }

    if (item.path) {
      navigate(item.path as string);
      onShowNavbarMobile();
    }
  };

  const getItemsMobile = useCallback((): INavbarMobile[] => {
    return [
      {
        key: "account",
        label: t("account"),
        icon: <FaRegUser className="size-6 min-w-6" />,
        path: "/account",
      },
      {
        key: "language",
        label: t("language"),
        icon: <AiOutlineGlobal className="size-6 min-w-6" />,
        path: "/",
        children: [
          {
            key: "language - en",
            label: "English",
            path: pathname,
            locale: "en",
          },
          {
            key: "language - vi",
            label: "Vietnamese",
            path: pathname,
            locale: "vi",
          },
        ],
      },
      {
        key: "auth",
        label: t("auth"),
        icon: <MdOutlineRemoveRedEye className="size-6 min-w-6" />,
        path: "/",
      },
      {
        key: "3",
        label: t("investment"),
        icon: <FaRegHandshake className="size-6 min-w-6" />,
        path: "/",
      },
      {
        key: "4",
        label: t("interests"),
        icon: <LuPencilRuler className="size-6 min-w-6" />,
        path: "/",
      },
    ];
  }, [darkMode, infoUser, i18n.resolvedLanguage]);

  useEffect(() => {
    const itemsMobile: INavbarMobile[] = getItemsMobile();
    setItemsShowMobile([itemsMobile]);
  }, [i18n.resolvedLanguage]);

  return (
    <Fragment>
      {/* Navbar on mobile */}
      <div
        className={clsx(
          "md:hidden block absolute top-full left-0 w-full overflow-x-hidden z-[99]",
          [showNavbarMobile ? "pointer-events-auto" : "pointer-events-none"],
        )}
      >
        <div
          className={clsx(
            "relative w-full max-h-[90vh] h-[90vh] bg-slate-100 dark:bg-[#252525] pb-10 transition-all ease-linear duration-200 overflow-y-auto",
            [
              showNavbarMobile
                ? "right-0 opacity-100"
                : "-right-full opacity-0 pointer-events-none",
            ],
          )}
        >
          {itemsShowMobile.length > 1 && (
            <button
              onClick={onBackItemMobile}
              className="flex items-center w-full text-base font-semibold hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white capitalize p-5 border-b-2 dark:border-b-neutral-400 gap-2"
            >
              <MdOutlineKeyboardArrowLeft className="size-6 min-w-6" />
              Back
            </button>
          )}
          <ul className="w-full">
            {itemsShowMobile.length > 0 &&
              itemsShowMobile[itemsShowMobile.length - 1].map(
                (item: INavbarMobile) => (
                  <li
                    key={item.key}
                    onClick={() => onClickItemMobile(item)}
                    className={clsx(
                      "flex items-center justify-between w-full p-5 cursor-pointer  gap-2",
                      [
                        pathname === item.key ||
                        i18n.resolvedLanguage === item.locale
                          ? "bg-[#1677ff] text-white"
                          : "hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white",
                      ],
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && item.icon}
                      <p className="text-base font-semibold capitalize">
                        {item.label}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {item.children && item.children?.length > 0 && (
                        <MdOutlineKeyboardArrowRight className="size-6 min-w-6" />
                      )}
                    </div>
                  </li>
                ),
              )}

            {itemsShowMobile.length === 1 && (
              <Fragment>
                <li className="flex items-center justify-between w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white gap-2">
                  <div className="flex items-center gap-2">
                    <IoMoonOutline className="size-6 min-w-6" />
                    <p className="text-base font-semibold capitalize">
                      {t("darkMode")}
                    </p>
                  </div>
                  <Switch
                    checked={darkMode}
                    defaultChecked={darkMode}
                    onClick={() => {
                      setDarkMode(!darkMode);
                      handleChangeMode();
                    }}
                  />
                </li>
                {infoUser.userId && (
                  <li
                    onClick={() => {
                      onLogout();
                      onShowNavbarMobile();
                    }}
                    className="flex items-center justify-between w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white border-t-2 dark:border-t-neutral-400 gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <MdLogout className="size-6 min-w-6" />
                      <p className="text-base font-semibold capitalize">
                        {t("logout")}
                      </p>
                    </div>
                  </li>
                )}
                {!infoUser.userId && (
                  <li>
                    <Link
                      to={"/login"}
                      className="flex items-center w-full p-5 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#ffffff0a] dark:text-white border-t-2 dark:border-t-neutral-400 gap-2"
                    >
                      <MdLogout className="size-6 min-w-6" />
                      <p className="text-base font-semibold capitalize">
                        {t("login")}
                      </p>
                    </Link>
                  </li>
                )}
              </Fragment>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default MobileMenu;
