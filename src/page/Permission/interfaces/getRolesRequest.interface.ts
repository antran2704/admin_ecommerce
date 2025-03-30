import { ISearch } from "~/interface";

export interface IGetRolesRequest extends ISearch {
    groupRoleId: string;
}