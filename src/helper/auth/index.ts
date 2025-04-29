import { TFunction } from "i18next";
import { ICheckPassword } from "~/interface/password";

const setAuthToken = (key: string, token: string) => {
  localStorage.setItem(key, JSON.stringify(token));
};

const getAuthToken = (key: string): string | null => {
  const value = localStorage.getItem(key);

  if (!value || value === "undefined") return null;

  return JSON.parse(value);
};

const removeAuthToken = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

const checkPassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Mật khẩu phải từ 8 kí tự";
  }

  const regexNumber = /\d/;
  const regexSpecialCharacter = /[!@#$%^&]/;

  // if (!regexAlphaLower.test(password)) {
  //   return "Phải có ít nhất một chữ thường";
  // }
  // if (!regexAlphaUpper.test(password)) {
  //   return "Phải có ít nhất một chữ hoa";
  // }
  if (!regexNumber.test(password)) {
    return "Phải có ít nhất một số";
  }

  if (!regexSpecialCharacter.test(password)) {
    return "Phải có ít nhất một ký tự đặc biệt: !,@,#,$,%,^,&";
  }

  return null;
};

const getListCheckPassword = (translate: TFunction): ICheckPassword[] => {
  return [
    {
      id: 1,
      title: translate("checkPassword.checkLength"),
      regex: /.{8,}/,
    },
    {
      id: 2,
      title: translate("checkPassword.checkNumber"),
      regex: /\d/,
    },
    {
      id: 3,
      title: translate("checkPassword.checkSpecial"),
      regex: /[!@#$%^&]/,
    },
  ];
};

const handleCheckValidPassword = (
  value: string,
  translate: TFunction,
): { valid: ICheckPassword[]; inValid: ICheckPassword[] } => {
  const listCheck = getListCheckPassword(translate);
  const valid: ICheckPassword[] = [];
  const inValid: ICheckPassword[] = [];

  for (const item of listCheck) {
    if (item.id === 1 && value.length >= 8) {
      valid.push(item);
      continue;
    }

    if (item.regex?.test(value)) {
      valid.push(item);
    } else {
      inValid.push(item);
    }
  }

  return { valid, inValid };
};

const checkEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// eslint-disable-next-line no-unused-vars
const checkFields = <T>(data: { [k in keyof T]: string }): boolean => {
  const keys: string[] = Object.keys(data);

  for (const key of keys) {
    if (!data[key as keyof T]) {
      return false;
    }
  }

  return true;
};

export {
  setAuthToken,
  getAuthToken,
  checkPassword,
  getListCheckPassword,
  handleCheckValidPassword,
  checkEmail,
  checkFields,
  removeAuthToken,
};
