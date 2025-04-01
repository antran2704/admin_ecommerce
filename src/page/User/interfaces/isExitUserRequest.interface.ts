import { ENUM_USER_PROVIDER } from "../enums";

export interface IIsExitUserRequest {
  email: string;
  provider: ENUM_USER_PROVIDER
}
