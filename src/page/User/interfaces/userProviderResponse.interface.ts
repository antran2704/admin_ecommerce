import { ENUM_USER_PROVIDER } from "../enums";

export interface IUserProviderResponse {
  providerId: string;
  provider: ENUM_USER_PROVIDER;
}
