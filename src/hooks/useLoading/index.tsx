import { useState } from "react";

const useLoading = <T extends Record<string, boolean>>(initValue: T) => {
  const [loading, setLoading] = useState<T>(initValue);

  // eslint-disable-next-line no-unused-vars
  const onLoading = (data: { [key in keyof Partial<T>]: boolean }) => {
    setLoading({
      ...loading,
      ...data,
    });
  };

  return { loading, onLoading };
};

export default useLoading;
