import { ConfigProvider as ConfigProviderAntd } from "antd";
import { ReactNode } from "react";
import { Provider as ProviderRedux } from "react-redux";
import { store } from "~/store";
import configGlobalAntd from "~/config/globalToken";
import MessageAntd from "../MessageAntd";

const MainComponent = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProviderAntd theme={configGlobalAntd}>
      <MessageAntd>
        <ProviderRedux store={store}>{children}</ProviderRedux>
      </MessageAntd>
    </ConfigProviderAntd>
  );
};

export default MainComponent;
