const convertToCamelCase = (str: string, character: string = "_"): string => {
  return str
    .toLowerCase()
    .split(character)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");
};

const checkValidNumber = (value: number): boolean => {
  const regexNumber = /^[0-9]*\.?[0-9]*$/;

  return Boolean(regexNumber.test(value.toString()));
};

const formatBigNumber = (value: number) => {
  return new Intl.NumberFormat("de-DE").format(value);
};

const revertBigNumberToString = (value: string) => {
  if (typeof value !== "string") return;

  return value.split(".").join("");
};

function formatData<T>(input: T): T {
  const newData = input as T;

  // Remove key if value is null or undefined
  if (newData === null || newData === undefined) {
    return;
  }

  // Remove key if value is empty string
  if (typeof newData === "string") {
    if (!!newData.trim().length) {
      return newData;
    }

    return;
  }

  for (const key in newData) {
    const value = newData[key];
    // Remove key if value is null or undefined
    if (value === null || value === undefined) {
      delete newData[key];
    }

    // Remove key if value is empty string
    if (typeof value === "string" && !value.trim()) {
      delete newData[key];
    }

    // Remove key if value is empty object
    if (
      value !== null &&
      value !== undefined &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      if (Object.keys(value).length === 0) {
        delete newData[key];
      }

      // Recursive call to formatData
      if (!!Object.keys(value).length) {
        const newItem = formatData(value);

        if (Object.keys(newItem).length === 0) {
          delete newData[key];
        } else {
          newData[key as any] = newItem;
        }
      }
    }

    // Remove key if value is empty array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        delete newData[key];
      } else {
        // recursive call to formatData
        newData[key as any] = value.filter((item) => formatData(item));
      }
    }
  }

  return newData;
}

const getTextFromHTML = (htmlString: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

export {
  checkValidNumber,
  formatBigNumber,
  revertBigNumberToString,
  convertToCamelCase,
  formatData,
  getTextFromHTML,
};
