/* eslint-disable no-console */
import { useContext } from "react";
import { BlockerRouterContext } from "~/context/blockerRouter";

const useBlockerRouter = () => {
  const blocker = useContext(BlockerRouterContext);
  if (!blocker) {
    console.error(
      "useBlockerRouter must be used within a BlockerRouter component",
    );

    console.error(
      "BlockerRouter component must be a parent of the component using the useBlockerRouter hook",
    );
    return {};
  }

  const { isBlockerRouter, onBlockerRouter } = blocker;

  return { isBlockerRouter, onBlockerRouter };
};

export default useBlockerRouter;
