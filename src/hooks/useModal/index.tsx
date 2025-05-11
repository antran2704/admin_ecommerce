import { useState } from "react";

const useModal = <T extends Record<string, boolean>>(initValue: T) => {
  const [modal, setModal] = useState<T>(initValue);

  // eslint-disable-next-line no-unused-vars
  const onModal = (data: { [key in keyof T]: boolean }) => {
    setModal({
      ...modal,
      ...data,
    });
  };

  return { modal, onModal };
};

export default useModal;
