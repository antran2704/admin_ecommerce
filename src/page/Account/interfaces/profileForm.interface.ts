import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

export interface IProfileForm {
    name: string;
    email: string;
    avatar: string;
    role: string;
    groupRole: string;
    status: ENUM_ACCOUNT_STATUS;
    createdAt: string;
}