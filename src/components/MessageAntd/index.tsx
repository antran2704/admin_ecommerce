import { message } from "antd";
import { MessageAntdProvider } from "~/context/messageAntd";

interface Props {
  children: React.ReactNode;
}

const MessageAntd = (props: Props) => {
  const { children } = props;
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <MessageAntdProvider value={{ messageAntd: messageApi }}>
      {children}
      {contextHolder}
    </MessageAntdProvider>
  );
};

export default MessageAntd;
