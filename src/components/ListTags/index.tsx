import { forwardRef, LegacyRef, useEffect, useState } from "react";
import type { InputProps, InputRef } from "antd";
import { Input, Tag } from "antd";
import FormField from "../Core/Input/FormField";
import { IFormField } from "~/interface/form";
import clsx from "clsx";

type Props = IFormField &
  InputProps & {
    data?: string[];
    onChange?: (tags: string[]) => void;
  };

const ListTag = (props: Props, ref: LegacyRef<InputRef>) => {
  const {
    data = [],
    disabled = false,
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    onChange,
    ...restProps
  } = props;

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);

    if (onChange) {
      onChange(newTags);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);

      if (onChange) {
        onChange([...tags, inputValue]);
      }
    }

    setInputValue("");
  };

  useEffect(() => {
    if (data.length && !tags.length) {
      setTags(data);
    }
  }, [data]);

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
      <div
        className={clsx(
          "w-full flex items-center flex-wrap p-1 border rounded-lg gap-2",
          [error ? "border-red-500" : "border-[#d9d9d9]"],
        )}
      >
        {tags.map((tag: string) => (
          <span key={tag} style={{ display: "inline-block" }}>
            <Tag
              closable={!disabled}
              onClose={(e) => {
                e.preventDefault();
                handleClose(tag);
              }}
              className="flex items-center text-sm !text-white bg-primary-color px-4 py-1 my-1 rounded-xl gap-2"
            >
              {tag}
            </Tag>
          </span>
        ))}

        <Input
          ref={ref}
          size="middle"
          disabled={disabled}
          placeholder="Please enter tag..."
          {...restProps}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          className="!flex-1 min-w-[100px] border-none"
        />
      </div>
    </FormField>
  );
};

export default forwardRef(ListTag);
