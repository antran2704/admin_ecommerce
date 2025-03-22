import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { GoArrowLeft } from "react-icons/go";
import clsx from "clsx";

import Breadcrumb from "~/components/Core/Breadcrumb/BreadcrumbCus";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  titleText?: string;
  titleEl?: React.ReactNode;
  backUrl?: string;
  listBreadcrumb?: ItemType[];
  className?: string;
}

const MainLayout = (props: Props) => {
  const { children, listBreadcrumb, titleText, titleEl, className, backUrl } =
    props;

  return (
    <div className={clsx("p-5 rounded-md", className)}>
      {listBreadcrumb && <Breadcrumb data={listBreadcrumb} />}
      <div className="flex items-center mt-3 gap-5">
        {backUrl && (
          <Link to={backUrl}>
            <GoArrowLeft className="text-2xl" />
          </Link>
        )}

        {titleEl ? (
          titleEl
        ) : (
          <h1 className="text-xl font-semibold">{titleText}</h1>
        )}
      </div>
      {children}
    </div>
  );
};

export default MainLayout;
