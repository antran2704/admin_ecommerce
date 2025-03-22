import { forwardRef, MouseEvent } from "react";
import { Select, SelectProps, Tag } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import { IFormField } from "~/interface/form";
import FormField from "../../Input/FormField";

type Props = Omit<SelectProps, "direction"> &
  IFormField & {
    borderBottom?: boolean;
    scrollVitual?: boolean;
    direction?: "vertical" | "horizontal";
    sort?: boolean;
    onScrollVitual?: () => void;
  };

type TagRender = SelectProps["tagRender"];

const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={"#2D9055"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      closeIcon={<IoIosCloseCircle className="size-4 min-w-4" />}
      onClose={onClose}
      className="flex items-center text-sm px-4 py-1 my-1 rounded-xl gap-2"
    >
      {label}
    </Tag>
  );
};

const SelectFilter = (props: Props, ref: any) => {
  const {
    title,
    borderBottom,
    scrollVitual,
    required = false,
    error = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    sort = false,
    classNameWrap,
    onScrollVitual,
    ...rest
  } = props;

  const handleScroll = (e: MouseEvent<HTMLDivElement>) => {
    if (!onScrollVitual || !scrollVitual) return;

    const element = e.currentTarget;
    const clientHeight = element.clientHeight;
    const scrollTop = element.scrollTop;

    if (clientHeight + scrollTop + 1 >= element.scrollHeight) {
      onScrollVitual();
    }
  };

  return (
    <FormField
      title={title}
      error={error}
      errorMessage={errorMessage}
      required={required}
      sizeText={sizeText}
      direction={direction}
      classNameWrap={classNameWrap}
    >
      {borderBottom && (
        <span className={"pb-4 border-b border-b-neutral-200"}></span>
      )}
      <Select
        size="large"
        ref={ref}
        className="w-full"
        menuItemSelectedIcon={null}
        showSearch
        filterOption={(input, option) =>
          ((option?.label as string).toLowerCase() ?? "").includes(
            input.toLowerCase(),
          )
        }
        filterSort={
          sort
            ? (optionA, optionB) =>
                ((optionA?.label as string) ?? "")
                  .toLowerCase()
                  .localeCompare(
                    ((optionB?.label as string) ?? "").toLowerCase(),
                  )
            : null
        }
        tagRender={tagRender}
        {...rest}
        status={error ? "error" : ""}
        onPopupScroll={handleScroll}
      />
    </FormField>
  );
};

export default forwardRef(SelectFilter);
