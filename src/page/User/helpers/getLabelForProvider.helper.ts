import { TFunction } from "i18next";
import { ENUM_USER_PROVIDER } from "../enums";

const getLabelForProvider = (t: TFunction, provider: ENUM_USER_PROVIDER) => {
    switch (provider) {
        case ENUM_USER_PROVIDER.GOOGLE:
            return t("provider.google");
        case ENUM_USER_PROVIDER.FACEBOOK:
            return t("provider.facebook");
        case ENUM_USER_PROVIDER.SYSTEM:
            return t("provider.system");
        default:
            return "";
    }
}

export default getLabelForProvider;