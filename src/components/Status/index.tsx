import clsx from "clsx";
import { memo } from "react";

interface Props {
  label?: string;
  classNames?: {
    wrap?: string;
    label?: string;
    dot?: string;
  };
}

const Status = (props: Props) => {
  const { label = "", classNames } = props;

  return (
    <div
      className={clsx(
        "w-fit flex items-center justify-center bg-neutral-200 p-2 min-w-[100px] mx-auto rounded-md gap-2",
        [classNames?.wrap],
      )}
    >
      <span
        className={clsx("rounded-full size-2 min-w-2", [classNames?.dot])}
      />
      <span
        className={clsx("whitespace-nowrap 2xl:text-sm text-xs", [
          classNames?.label,
        ])}
      >
        {label}
      </span>
    </div>
  );
};

export default memo(Status);
