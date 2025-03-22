interface IRoleItem {
  id: string;
  name: string;
}
interface IRole {
  _id: string;
  name: string;
  groupId: string;
  permissions: string[];
  createdAt: string;
  totalUsers: number;
}

interface ICreateRole {
  name: string;
  groupId: string;
}

interface IRoleSearch {
  groupId?: string;
}

export type { IRoleItem, IRole, IRoleSearch, ICreateRole };
