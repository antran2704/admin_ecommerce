import clsx from "clsx";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { FiCopy } from "react-icons/fi";
import useMessageAntd from "~/hooks/useMessageAntd";

interface Props {
  value: string;
  classNames?: {
    icons?: string;
    wrap?: string;
  };
  icon?: JSX.Element;
  addonAfter?: JSX.Element | string;
  addonBefore?: JSX.Element | string;
}

const Copy = (props: Props) => {
  const { value, classNames, icon, addonAfter, addonBefore } = props;

  const { t: tCommon } = useTranslation("Common");
  const { messageAntd } = useMessageAntd();

  const onClick = () => {
    navigator.clipboard.writeText(value);
    messageAntd.success(tCommon("copied"));
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex items-center cursor-pointer hover:text-primary-color transition-all ease-linear duration-75 gap-2",
        classNames?.wrap,
      )}
    >
      {addonBefore}

      {!icon && <FiCopy className={clsx(classNames?.icons)} />}

      {icon}

      {addonAfter}
    </div>
  );
};

export default memo(Copy);
