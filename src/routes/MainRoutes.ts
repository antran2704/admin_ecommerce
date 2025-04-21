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

// Category
const CategoryPage = lazy(() => import("~/page/Category"));
const CreateCategoryPage = lazy(() => import("~/page/Category/create"));
const UpdateCategoryPage = lazy(() => import("~/page/Category/edit"));

// Variant type
const VariantTypePage = lazy(() => import("~/page/VariantType"));
const CreateVariantTypePage = lazy(() => import("~/page/VariantType/create"));
const UpdateVariantTypePage = lazy(() => import("~/page/VariantType/edit"));

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

  // Category
  {
    id: uuidv4(),
    href: PATH_NAME.CATEGORIES,
    element: CategoryPage,
    subject: EPageRole.ADMIN_CATEGORY,
    action: EPermisisonAction.VIEW,
  },
  {
    id: uuidv4(),
    href: PATH_NAME.CREATE_CATEGORY,
    element: CreateCategoryPage,
    subject: EPageRole.ADMIN_CATEGORY,
    action: EPermisisonAction.CREATE,
  },
  {
    id: uuidv4(),
    href: `${PATH_NAME.CATEGORIES}/:category_id`,
    element: UpdateCategoryPage,
    subject: EPageRole.ADMIN_CATEGORY,
    action: EPermisisonAction.VIEW,
  },

  // Variant type
  {
    id: uuidv4(),
    href: PATH_NAME.VARIANT_TYPES,
    element: VariantTypePage,
    subject: EPageRole.ADMIN_VARIANT_TYPE,
    action: EPermisisonAction.VIEW,
  },
  {
    id: uuidv4(),
    href: PATH_NAME.CREATE_VARIANT_TYPE,
    element: CreateVariantTypePage,
    subject: EPageRole.ADMIN_VARIANT_TYPE,
    action: EPermisisonAction.CREATE,
  },
  {
    id: uuidv4(),
    href: `${PATH_NAME.VARIANT_TYPES}/:variant_type_id`,
    element: UpdateVariantTypePage,
    subject: EPageRole.ADMIN_VARIANT_TYPE,
    action: EPermisisonAction.VIEW,
  },
];

export default MainRoutes;
