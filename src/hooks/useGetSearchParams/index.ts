/* eslint-disable no-unused-vars */
import { useSearchParams } from "react-router-dom";

function useGetSearchParams<T>(items: {
  [x in keyof T]: "string" | "number" | "array" | "boolean";
}) {
  const [searchParams] = useSearchParams();

  const result = {} as {
    [x in keyof T]: string | string[] | number | boolean | null;
  };

  Object.keys(items).forEach((key) => {
    if (items[key] === "array") {
      return (result[key] = searchParams.getAll(key));
    }

    const valueParam = searchParams.get(key);
    let value: string | number | boolean | null = null;

    switch (items[key]) {
      case "string":
        value = valueParam;
        break;

      case "number":
        value = valueParam ? Number(valueParam) : null;
        break;

      case "boolean":
        value =
          valueParam === "true" ? true : valueParam === "false" ? false : null;
        break;

      default:
        null;
    }

    result[key] = value;
  });

  return result;
}

export default useGetSearchParams;
