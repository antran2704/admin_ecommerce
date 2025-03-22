import { EPageRole, EPermisisonAction } from "~/enum/constants";

interface IAddRule {
  action: EPermisisonAction;
  subject: EPageRole;
}

interface IPermissionChild {
  title: string;
  key: string;
}

interface IPermission {
  title: string;
  key: string;
  children?: IPermissionChild[];
}

export type { IAddRule, IPermission };
