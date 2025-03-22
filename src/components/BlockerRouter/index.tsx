import { Fragment, useEffect, useState } from "react";
import { BlockerRouterProvider } from "~/context/blockerRouter";
import { ModalAlert } from "../Modal";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props {
  children: React.ReactNode;
}

const BlockerRouter = (props: Props) => {
  const { children } = props;
  const { t: tCommon } = useTranslation("Common");

  const [isBlocker, setIsBlocker] = useState<boolean>(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isBlocker && currentLocation.pathname !== nextLocation.pathname,
  );

  const onProceed = () => {
    setIsBlocker(false);
    blocker.proceed();
  };

  const onCancel = () => {
    blocker.reset();
  };

  const onBlockerRouter = (value: boolean) => {
    setIsBlocker(value);
  };

  const onShowAlertBrowser = (e: BeforeUnloadEvent) => {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
      e.returnValue = "Sure?";
    }

    // For Safari
    return "Sure?";
  };

  useEffect(() => {
    if (!window || !isBlocker) return;
    window.addEventListener("beforeunload", onShowAlertBrowser);

    return () => {
      window.removeEventListener("beforeunload", onShowAlertBrowser);
    };
  }, [isBlocker]);

  return (
    <Fragment>
      <BlockerRouterProvider
        value={{ isBlockerRouter: isBlocker, onBlockerRouter }}
      >
        {children}
      </BlockerRouterProvider>

      <ModalAlert
        title={tCommon("modal.blocker.title")}
        open={blocker.state === "blocked"}
        okText={tCommon("agree")}
        cancelText={tCommon("cancel")}
        onOk={onProceed}
        onCancel={onCancel}
      >
        <p className="text-base text-center w-2/3 mx-auto">
          {tCommon("modal.blocker.description")}
        </p>
      </ModalAlert>
    </Fragment>
  );
};

export default BlockerRouter;
