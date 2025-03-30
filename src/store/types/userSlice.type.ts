import { IMeProfile } from "~/page/Account/interfaces";

interface IUserSlice {
  infoUser: IMeProfile;
  permission: string[];
  loadingUser: boolean;
}

export type { IUserSlice };