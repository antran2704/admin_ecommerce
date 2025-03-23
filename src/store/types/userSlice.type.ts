import { IMeProfile } from "~/interface/profile";

interface IUserSlice {
  infoUser: IMeProfile;
  permission: string[];
  loadingUser: boolean;
}

export type { IUserSlice };