import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { IFormField } from "~/interface/form";

const FormField = (props: IFormField) => {
  const {
    title,
    error,
    required = false,
    errorMessage,
    sizeText = "medium",
    direction = "vertical",
    classNameWrap,
    children,
  } = props;

  const { t: tError } = useTranslation("Error");

  return (
    <div
      className={clsx("flex", [
        direction === "vertical"
          ? "flex-col"
          : "flex-row flex-wrap items-center gap-5",
        classNameWrap,
      ])}
    >
      {title && (
        <p
          className={clsx(
            "dark:text-darkInput",
            [
              sizeText === "large" && "text-lg",
              sizeText === "medium" && "text-base",
              sizeText === "small" && "text-sm",
            ],
            [direction === "vertical" && "pb-2"],
          )}
        >
          {title}
          {required && <span className="pl-1 text-red-500">*</span>}
        </p>
      )}
      {children}

      {error && errorMessage !== null && (
        <p className="text-sm text-red-500">
          {errorMessage ? errorMessage : tError("REQUIRE_FIELD")}
        </p>
      )}
    </div>
  );
};

export default FormField;
