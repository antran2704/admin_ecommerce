import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props {
  data: ItemType[];
  separator?: string;
}

const BreadcrumbCore = (props: Props) => {
  const { data, separator = ">" } = props;

  const { t } = useTranslation("Common");

  return (
    <Breadcrumb
      items={[
        {
          title: (
            <Link
              to={"/"}
              className="dark:!text-white dark:hover:!text-primary-200"
            >
              {t("breadcrumb.home")}
            </Link>
          ),
        },
        ...data.map((item: ItemType, index: number) => ({
          ...item,
          title: item.href ? (
            <Link
              to={item.href}
              className={clsx(
                "block dark:!text-white dark:hover:!text-primary-200",
                [index === data.length - 1 && "font-semibold"],
              )}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className={clsx("dark:!text-white", [
                index === data.length - 1 && "font-semibold",
              ])}
            >
              {item.title}
            </span>
          ),
          href: undefined,
        })),
      ]}
      separator={<span className="dark:!text-white">{separator}</span>}
    />
  );
};

export default BreadcrumbCore;
