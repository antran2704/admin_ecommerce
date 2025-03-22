import { MessageInstance } from "antd/es/message/interface";
import { createContext } from "react";

interface IMessageAntd {
  messageAntd: MessageInstance;
}

export const MessageAntdContext = createContext<IMessageAntd>(null);
export const MessageAntdProvider = MessageAntdContext.Provider;
