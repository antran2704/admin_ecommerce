import { Avatar, Dropdown, MenuProps, Switch } from "antd";
import { ItemType } from "antd/es/menu/interface";
import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegUser, FaUserAlt } from "react-icons/fa";
import { IoMoonOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

import { NO_IMAGE } from "~/common/image";
import { handleChangeMode } from "~/helper/darkmode";
import { useAppSelector } from "~/store/hooks";

import enLanguageImage from "@assets/images/language/en.png";
import viLanguageImage from "@assets/images/language/vi.png";

interface Props {
  onLogout: () => void;
}

const DropdownMenu = (props: Props) => {
  const { onLogout } = props;

  const { t, i18n } = useTranslation("Navbar");

  const { pathname } = useLocation();

  const { infoUser } = useAppSelector((state) => state.user);

  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark" ? true : false,
  );
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showLanguage, setShowLanguage] = useState<boolean>(false);

  const onShowLanguage = () => {
    setShowLanguage(!showLanguage);
  };

  const onShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const onClickDropDown = (info: ItemType): void => {
    switch (info.key) {
      case "language":
        onShowDropdown();
        onShowLanguage();
        break;

      case "darkMode":
        break;
    }
  };

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "infoUser",
        label: (
          <Link
            to="/account"
            className="min-w-[240px] flex items-center px-2 py-1 gap-2"
          >
            {infoUser.avaratar && (
              <img
                className="size-10 min-w-10 border object-cover object-center rounded-full"
                src={infoUser.avaratar}
              />
            )}
            {!infoUser.avaratar && (
              <FaRegUser className="size-6 min-w-6 " />
            )}
            <p className="text-sm font-semibold text-[#2B2B2B]">
              {t("account")}
              <span className="block text-xs text-gray-200">
                {infoUser.email}
              </span>
            </p>
          </Link>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "/account",
        label: (
          <Link
            to="/account"
            className="min-w-[240px] flex items-center  px-4 py-1 gap-2"
          >
            <FaRegUser className="size-5 min-w-5" />
            <p className="text-base font-semibold capitalize">
              {t("infoAccount")}
            </p>
          </Link>
        ),
      },
      {
        key: "darkMode",
        label: (
          <div className="min-w-[240px] flex items-center justify-between  px-4 py-1 gap-2">
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
          </div>
        ),
      },
      {
        type: "divider",
      },
      {
        key: "auth",
        label: infoUser.userId ? (
          <button
            onClick={onLogout}
            className="min-w-[240px] flex items-center  px-4 py-1 gap-2"
          >
            <MdLogout className="size-6 min-w-6" />
            <p className="text-base font-semibold capitalize">{t("logout")}</p>
          </button>
        ) : (
          <Link
            to="/login"
            className="min-w-[240px] flex items-center  px-4 py-1 gap-2"
          >
            <MdLogout className="size-6 min-w-6" />
            <p className="text-base font-semibold capitalize">{t("login")}</p>
          </Link>
        ),
      },
    ];
  }, [darkMode, infoUser, i18n.resolvedLanguage]);

  const itemsLanguage: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "vi",
        label: (
          <button
            onClick={() => i18n.changeLanguage("vi")}
            className="min-w-[240px] flex items-center px-4 py-1 text-base font-semibold capitalize gap-2"
          >
            <img
              src={viLanguageImage}
              className="size-5 min-w-5 object-contain"
              alt="language"
            />
            Tiếng Việt
          </button>
        ),
      },
      {
        key: "en",
        label: (
          <button
            onClick={() => i18n.changeLanguage("en")}
            className="min-w-[240px] flex items-center px-4 py-1 text-base font-semibold capitalize gap-2"
          >
            <img
              src={enLanguageImage}
              className="size-5 min-w-5 object-contain"
              alt="language"
            />
            English
          </button>
        ),
      },
    ];
  }, [pathname]);

  return (
    <Fragment>
      <div className="md:hidden flex items-center justify-center bg-[#F4F4F4] h-10 w-10 rounded-lg">
        {!infoUser.avaratar && <Avatar icon={<FaUserAlt />} />}
        {infoUser.avaratar && (
          <Link to={"/account"}>
            <img
              onError={(e) => (e.currentTarget.src = NO_IMAGE)}
              src={infoUser.avaratar}
              className="min-w-8 w-8 h-8 rounded-full object-cover object-center"
              alt="avartar"
            />
          </Link>
        )}
      </div>

      {/* Drop down menu */}
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [pathname],
          selectedKeys: [pathname],
          onClick: onClickDropDown,
          onMouseLeave: onShowDropdown,
        }}
        open={showDropdown}
        placement="bottomLeft"
        trigger={["click"]}
        overlayClassName="menu"
      >
        <div
          onClick={onShowDropdown}
          className="md:flex hidden items-center justify-center cursor-pointer hover:text-primary-300 bg-[#F4F4F4] dark:bg-gray-500  h-10 w-10 rounded-lg"
        >
          {!infoUser.avaratar && <Avatar icon={<FaUserAlt />} />}
          {infoUser.avaratar && (
            <img
              onError={(e) => (e.currentTarget.src = NO_IMAGE)}
              src={infoUser.avaratar}
              className="min-w-8 w-8 h-8 rounded-full object-cover object-center"
              alt="avartar"
            />
          )}
        </div>
      </Dropdown>

      {/* Drop down select language */}
      <Dropdown
        menu={{
          items: itemsLanguage,
          selectable: true,
          selectedKeys: [i18n.resolvedLanguage as string],
          onMouseLeave: onShowLanguage,
        }}
        open={showLanguage}
        placement="bottomLeft"
        overlayClassName="menu"
      >
        <div className="cursor-pointer" onClick={onShowLanguage}>
          <img
            src={
              i18n.resolvedLanguage === "vi" ? viLanguageImage : enLanguageImage
            }
            className="w-6 h-6"
            alt="language"
          />
        </div>
      </Dropdown>
    </Fragment>
  );
};

export default DropdownMenu;
