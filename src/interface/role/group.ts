import { ISearch } from "../paramater";

interface IGroupRole {
  _id: string;
  name: string;
}

interface ICreateRoleGroup {
  name: string;
}

interface IUpdateRoleGroup {
  name: string;
}

type IGroupRoleSearch = Pick<ISearch, "search">;

export type {
  IGroupRole,
  IUpdateRoleGroup,
  ICreateRoleGroup,
  IGroupRoleSearch,
};
