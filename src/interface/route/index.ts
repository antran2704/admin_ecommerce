import { EPageRole, EPermisisonAction } from "~/enum/constants";

interface IRoute {
  id: string;
  element: React.ComponentType;
  href: string;
  action?: EPermisisonAction;
  subject?: EPageRole;
}

export type { IRoute };
