import { createContext } from "react";
import { createContextualCan } from "@casl/react";

const AbilityContext = createContext(null);
export const AbilityContextProvider = AbilityContext.Provider;
export const Can = createContextualCan(AbilityContext.Consumer);
