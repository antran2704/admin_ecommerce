import { useState } from "react";

const useLoading = <T extends Record<string, boolean>>(initValue: T) => {
  const [loading, setLoading] = useState<T>(initValue);

  const onLoading = (data: { [key in keyof T]: boolean }) => {
    setLoading({
      ...loading,
      ...data,
    });
  };

  return { loading, onLoading };
};

export default useLoading;
