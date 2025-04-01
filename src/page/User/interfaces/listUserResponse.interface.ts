import { IUserProviderResponse } from "./userProviderResponse.interface";

export interface IListUserResponse {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  phoneNumber: string;
  birthday: string;
  providers: IUserProviderResponse[];
  isActive: boolean;
  createdAt: string;
}
