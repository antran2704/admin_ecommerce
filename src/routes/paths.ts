const PATH_NAME = {
  HOME: "/",
  ACCOUNT: "/account",
  PERMISSIONS: "/permissions",

  // STAFFS
  STAFFS: "/staffs",
  CREATE_STAFF: "/staffs/create",
  UPDATE_STAFF: (id: string) => `/staffs/${id}`,

  // USERS
  USERS: "/users",
  CREATE_USER: "/users/create",
  UPDATE_USER: (id: string) => `/users/${id}`,

  // CAREGORIES
  CATEGORIES: "/categories",
  CREATE_CATEGORY: "/categories/create",
  UPDATE_CATEGORY: (id: string) => `/categories/${id}`,

  // VARIANT TYPES
  VARIANT_TYPES: "/variant-types",
  CREATE_VARIANT_TYPE: "/variant-types/create",
  UPDATE_VARIANT_TYPE: (id: string) => `/variant-types/${id}`,

  // PRODUCTS
  PRODUCTS: "/products",
  CREATE_PRODUCT: "/products/create",
  UPDATE_PRODUCT: (id: string) => `/products/${id}`,

  // NEWS
  NEWS: "/news",
  CREATE_NEWS: "/news/create",
  UPDATE_NEWS: "/news/:id",
};

export default PATH_NAME;
