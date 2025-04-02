import { lazy } from "react";
import { v4 as uuidv4 } from "uuid";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { IRoute } from "~/interface/route";
import PATH_NAME from "./paths";

const AccountPage = lazy(() => import("~/page/Account"));
const HomePage = lazy(() => import("~/page/Home"));

// Permission
const PermissionPage = lazy(() => import("~/page/Permission"));

// Staff
const StaffPage = lazy(() => import("~/page/Staff"));
const CreateStaffPage = lazy(() => import("~/page/Staff/create"));
const UpdateStaffPage = lazy(() => import("~/page/Staff/edit"));

// User
const UserPage = lazy(() => import("~/page/User"));
const CreateUserPage = lazy(() => import("~/page/User/create"));
const UpdateUserPage = lazy(() => import("~/page/User/edit"));

const MainRoutes: IRoute[] = [
  {
    id: uuidv4(),
    href: PATH_NAME.HOME,
    element: HomePage,
  },
  {
    id: uuidv4(),
    href: PATH_NAME.ACCOUNT,
    element: AccountPage,
  },

  // Permission
  {
    id: uuidv4(),
    href: PATH_NAME.PERMISSIONS,
    element: PermissionPage,
    subject: EPageRole.ADMIN_GROUP_ROLE,
    action: EPermisisonAction.VIEW,
  },

  // Staff
  {
    id: uuidv4(),
    href: PATH_NAME.STAFFS,
    element: StaffPage,
    subject: EPageRole.ADMIN_STAFF,
    action: EPermisisonAction.VIEW,
  },
  {
    id: uuidv4(),
    href: PATH_NAME.CREATE_STAFF,
    element: CreateStaffPage,
    subject: EPageRole.ADMIN_STAFF,
    action: EPermisisonAction.CREATE,
  },
  {
    id: uuidv4(),
    href: `${PATH_NAME.STAFFS}/:staff_id`,
    element: UpdateStaffPage,
    subject: EPageRole.ADMIN_STAFF,
    action: EPermisisonAction.VIEW,
  },

  // User
  {
    id: uuidv4(),
    href: PATH_NAME.USERS,
    element: UserPage,
    subject: EPageRole.ADMIN_USER,
    action: EPermisisonAction.VIEW,
  },
  {
    id: uuidv4(),
    href: PATH_NAME.CREATE_USER,
    element: CreateUserPage,
    subject: EPageRole.ADMIN_USER,
    action: EPermisisonAction.CREATE,
  },
  {
    id: uuidv4(),
    href: `${PATH_NAME.USERS}/:user_id`,
    element: UpdateUserPage,
    subject: EPageRole.ADMIN_USER,
    action: EPermisisonAction.VIEW,
  },
];

export default MainRoutes;
