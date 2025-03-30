interface IMeProfile {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  roleId: string;
  groupRole: string;
  groupRoleId: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export type { IMeProfile };
