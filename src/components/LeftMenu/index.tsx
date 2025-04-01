import { Button, Menu, MenuProps } from "antd";
import { Fragment, useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useWindowDimensions from "~/hooks/useWindowDimensions";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { changeSidebar } from "~/store/slice/setting";

import "./SideBar.scss";
import sidebarIcons from "./icons";
import { LOGO } from "~/common/image";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import PATH_NAME from "~/routes/paths";

const env = import.meta.env.VITE_ENVIRONMENT as string;

type MenuItem = Required<MenuProps>["items"][number];

const LeftMenu = () => {
  const { t, i18n } = useTranslation("Sidebar");

  const dispatch = useAppDispatch();
  const { isOpenSidebar } = useAppSelector((state) => state.setting);
  const { permission } = useAppSelector((state) => state.user);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(!isOpenSidebar);
  const { width } = useWindowDimensions();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    dispatch(changeSidebar(!isOpenSidebar));
  };

  const onClickItem = (path: string): void => {
    if (width && width < 768 && !collapsed) {
      toggleCollapsed();
    }

    navigate(path);
  };

  const getPathName = useCallback(
    (path: string): string => {
      return pathname.includes(path) ? pathname : path;
    },
    [pathname],
  );

  const items: MenuItem[] = useMemo((): MenuItem[] => {
    return [
      {
        key: PATH_NAME.HOME,
        icon: sidebarIcons.dashboard,
        label: "Dashboard",
        onClick: () => onClickItem("/"),
      },
      ability.can(EPermisisonAction.VIEW, EPageRole.ADMIN_GROUP_ROLE) && {
        key: PATH_NAME.PERMISSIONS,
        icon: sidebarIcons.permission,
        label: t("permission"),
        onClick: () => onClickItem("/permissions"),
      },
      ability.can(EPermisisonAction.VIEW, EPageRole.ADMIN_STAFF) && {
        key: getPathName(PATH_NAME.STAFFS),
        icon: sidebarIcons.staff,
        label: t("staff"),
        onClick: () => onClickItem(PATH_NAME.STAFFS),
      },
      ability.can(EPermisisonAction.VIEW, EPageRole.ADMIN_USER) && {
        key: getPathName(PATH_NAME.USERS),
        icon: sidebarIcons.user,
        label: t("user"),
        onClick: () => onClickItem(PATH_NAME.USERS),
      },
      ability.can(EPermisisonAction.VIEW, EPageRole.ADMIN_CATEGORY) && {
        key: getPathName(PATH_NAME.CATEGORIES),
        icon: sidebarIcons.category,
        label: t("category"),
        onClick: () => onClickItem(PATH_NAME.CATEGORIES),
      },
      ability.can(EPermisisonAction.VIEW, EPageRole.ADMIN_PAGE_NEWS) && {
        key: getPathName(PATH_NAME.NEWS),
        icon: sidebarIcons.news,
        label: t("news"),
        onClick: () => onClickItem(PATH_NAME.NEWS),
      },
    ];
  }, [pathname, i18n.resolvedLanguage, width, collapsed, permission]);

  return (
    <Fragment>
      <div
        className={clsx(
          "top-0 h-screen fixed shadow-lg transition-all ease-linear duration-150 z-[120]",
          collapsed
            ? "xl:min-w-[110px] xl:w-[4%] w-0"
            : "collapsed xl:min-w-[300px] xl:w-[10%] md:w-4/12 w-8/12",
        )}
      >
        <div className="w-full h-full py-5 xl:pl-2 bg-white">
          <div className="flex items-center">
            <div className="w-full">
              <Link to={"/"} className="flex items-center !p-5 gap-2">
                <img
                  src={LOGO}
                  alt="logo"
                  className={clsx(
                    "h-full transition-all ease-linear duration-100",
                    [isOpenSidebar ? "size-32" : "size-20"],
                  )}
                />
              </Link>
              <Menu
                defaultSelectedKeys={[pathname]}
                selectedKeys={[pathname]}
                mode="inline"
                theme="light"
                inlineCollapsed={collapsed}
                items={items}
                className="sidebar max-h-[80vh] md:min-w-none xl:min-w-[90px] !border-none overflow-y-auto dark:bg-black-50 !pb-10"
              />
            </div>
            <Button
              type="primary"
              onClick={toggleCollapsed}
              className={clsx(
                "!rounded-full !shadow-none !p-0 h-[84px] !w-fit !bg-transparent hover:!bg-green-200/40 z-10",
                collapsed && "xl:-translate-x-3",
              )}
            >
              {collapsed ? (
                <IoIosArrowForward className="size-6 text-lg text-green-500" />
              ) : (
                <IoIosArrowBack className="size-6 text-lg text-green-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div
        onClick={toggleCollapsed}
        className={clsx(
          "block fixed left-0 right-0 top-0 bottom-0 bg-black/50 transition-all ease-linear duration-100 z-[100]",
          [collapsed ? "opacity-0 pointer-events-none" : "opacity-100"],
        )}
      ></div>
    </Fragment>
  );
};

export default LeftMenu;
