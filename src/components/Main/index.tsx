import { ConfigProvider as ConfigProviderAntd } from "antd";
import { ReactNode } from "react";
import { Provider as ProviderRedux } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";

import { store } from "~/store";
import configGlobalAntd from "~/config/globalToken";
import MessageAntd from "../MessageAntd";
import { queryClient } from "~/config/reactQuery";

const MainComponent = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigProviderAntd theme={configGlobalAntd}>
      <QueryClientProvider client={queryClient}>
        <MessageAntd>
          <ProviderRedux store={store}>{children}</ProviderRedux>
        </MessageAntd>
      </QueryClientProvider>
    </ConfigProviderAntd>
  );
};

export default MainComponent;
