import qs from "qs";

const urlToBase64 = (value: string) => {
  return btoa(value.replace(/%([0-9A-F]{2})/g, "")).replaceAll("?", "");
};

const decodeUrl = (value: string) => {
  try {
    return atob(value.replace(/%([0-9A-F]{2})/g, ""));
  } catch (error) {
    return "";
  }
};

const stringToSlug = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/-/g, "-")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const slugToString = (str: string) => {
  return str
    .split("-")
    .map((word) => (word === "" ? "-" : word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const removeFieldsFromQueryObject = <K>(paramater: K, fields: (keyof K)[]) => {
  const queryObject = { ...paramater };

  // Delete the specified field
  for (const field of fields) {
    delete queryObject[field];
  }

  return queryObject;
};

const parseQueryString = <T>(
  currentParam: T,
  options?: qs.IStringifyOptions<qs.BooleanOptional>,
) => {
  const parseParameters = qs.stringify(
    { ...currentParam },
    {
      indices: false, // false: a: ['b', 'c', 'd'] => a=b&a=c&a=d
      encode: false, // false: a: a%20b => a=a b
      addQueryPrefix: true, // true: a: 'b' => ?a=b
      filter: (_, value) => value || undefined,
      ...options,
    },
  );

  return parseParameters;
};

export {
  urlToBase64,
  decodeUrl,
  stringToSlug,
  slugToString,
  parseQueryString,
  removeFieldsFromQueryObject,
};
