import clsx from "clsx";
import { useTranslation } from "react-i18next";
import noDataImg from "~/assets/images/no_data.png";

interface Props {
  className?: string;
  image?: string;
}

const NoData = (props: Props) => {
  const { className, image } = props;
  const { t } = useTranslation("Common");

  return (
    <div
      className={clsx(
        "md:w-3/4 w-full flex items-center justify-center flex-col py-10 mx-auto",
        className,
      )}
    >
      <img src={image ? image : noDataImg} />
      <p className="text-base font-medium text-gray-700 mt-5">{t("noData")}</p>
    </div>
  );
};

export default NoData;
