import { createContext } from "react";
import { IUpdateProductContext } from "../interfaces";

export const UpdateProductContext = createContext<IUpdateProductContext>({
  product: null,
  setProduct: () => {},
});

export const UpdateProductProvider = UpdateProductContext.Provider;
