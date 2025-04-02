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

  // NEWS
  NEWS: "/news",
  CREATE_NEWS: "/news/create",
  UPDATE_NEWS: "/news/:id",
};

export default PATH_NAME;
