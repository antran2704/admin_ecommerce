import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import { useDebounce } from "use-debounce";
import clsx from "clsx";

import "ckeditor5/ckeditor5.css";
import "./index.scss";

import CustomUploadAdapterPlugin from "./common/uploadAdapterPlugin";
import { IFormField } from "~/interface/form";
import FormField from "../Core/Input/FormField";
import editorConfig from "./common/config";

interface Props extends IFormField {
  defaultContent?: string;
  disabled?: boolean;
  debounce?: number;
  placeholder?: string;
  callbackUpload?: (file: File) => Promise<any>;
  error?: boolean;
  maxLength?: number;
  getContent?: (content: string) => void;
}

export default function MyCKEditor(props: Props) {
  const {
    defaultContent = "",
    debounce = 1000,
    disabled = false,
    placeholder = "Enter your content...",
    title,
    error = false,
    callbackUpload,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    getContent,
  } = props;

  const [value, setValue] = useState<string>(defaultContent);
  const [newValue] = useDebounce(value, debounce);

  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const onChangeContent = (newConten: string) => {
    setValue(newConten);
  };

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  useEffect(() => {
    if (newValue === defaultContent) return;

    getContent && getContent(value);
  }, [newValue]);

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
      <div className={clsx([error && "error"])}>
        {isLayoutReady && (
          <CKEditor
            editor={ClassicEditor}
            disabled={disabled}
            data={value}
            config={{
              ...editorConfig,
              placeholder,
              extraPlugins: [
                CustomUploadAdapterPlugin({
                  callbackUpload,
                }),
              ],
            }}
            onChange={(_, editor) => {
              const data = editor.getData();
              onChangeContent(data);
            }}
          />
        )}
      </div>
    </FormField>
  );
}
