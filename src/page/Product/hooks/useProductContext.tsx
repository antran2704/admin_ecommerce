import { useContext } from "react";
import { UpdateProductContext } from "../contexts";

const useProductContext = () => {
  const data = useContext(UpdateProductContext);

  if (!data) {
    throw new Error(
      "useProductContext must be used within a UpdateProductProvider",
    );
  }

  return data;
};

export default useProductContext;
