/* eslint-disable no-console */
import { useContext } from "react";
import { MessageAntdContext } from "~/context/messageAntd";

const useMessageAntd = () => {
  const message = useContext(MessageAntdContext);
  if (!message) {
    console.error("useMessageAntd must be used within a MessageAntd component");
    console.error(
      "MessageAntd component must be wrappped in the root component of the application",
    );
    return {};
  }

  const { messageAntd } = message;

  return { messageAntd };
};

export default useMessageAntd;
