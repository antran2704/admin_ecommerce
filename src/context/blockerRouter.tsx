import { createContext } from "react";

interface IBlockerRouterContext {
  isBlockerRouter: boolean;
  onBlockerRouter: (value: boolean) => void;
}

export const BlockerRouterContext = createContext<IBlockerRouterContext>(null);
export const BlockerRouterProvider = BlockerRouterContext.Provider;
