const checkPhoneNumber = (codeArea: string, phone: string): string => {
  let phoneNumber = phone;
  if (phoneNumber.length >= 10) {
    phoneNumber = phoneNumber.slice(1);
  }

  phoneNumber = codeArea.slice(1) + phoneNumber;

  return phoneNumber;
};

const getPhoneNumberAndCodeArea = (
  phoneNumber: string = "",
): { codeArea: string; phone: string } => {
  const codeArea = phoneNumber ? phoneNumber.slice(0, 2) : "84";
  const phone = phoneNumber ? phoneNumber.slice(2) : "";

  return { codeArea, phone };
};

const combinePhoneNumber = (codeArea: string, phone: string): string => {
  if (!phone) return "";

  const phoneNumber = phone.charAt(0) === "0" ? phone.replace("0", "") : phone;
  return codeArea + phoneNumber;
};

export { checkPhoneNumber, getPhoneNumberAndCodeArea, combinePhoneNumber };
