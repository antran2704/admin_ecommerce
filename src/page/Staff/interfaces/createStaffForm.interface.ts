import { ENUM_ACCOUNT_STATUS } from "~/enum/user";

export interface IStaffForm {
    email: string;
    name: string;
    role: string;
    groupRole: string;
    avatar: string;
    avatarFile: File | null;
    password: string;
    confirmPassword: string;
    status: ENUM_ACCOUNT_STATUS;
}