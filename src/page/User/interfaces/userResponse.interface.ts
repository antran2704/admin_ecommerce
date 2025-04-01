import { IUserProviderResponse } from "./userProviderResponse.interface";

export interface IUserResponse {
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
