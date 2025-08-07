import { FaRegUser } from "react-icons/fa";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { CiBoxes } from "react-icons/ci";

import dashboardImg from "~/assets/images/Sidebar/dashboard.png";
import permissionImg from "~/assets/images/Sidebar/permission.png";
import staffImg from "~/assets/images/Sidebar/staff.png";
import NewsImg from "~/assets/images/Sidebar/news.png";

const sidebarIcons: { [x: string]: JSX.Element } = {
  dashboard: (
    <div className="wrap__menu-icon">
      <img
        src={dashboardImg}
        alt="icon sidebar"
        title="icon sidebar"
        className="menu__icon object-contain"
      />
    </div>
  ),
  permission: (
    <div className="wrap__menu-icon">
      <img
        src={permissionImg}
        alt="icon sidebar"
        title="icon sidebar"
        className="menu__icon object-contain"
      />
    </div>
  ),
  staff: (
    <div className="wrap__menu-icon">
      <img
        src={staffImg}
        alt="icon sidebar"
        title="icon sidebar"
        className="menu__icon object-contain"
      />
    </div>
  ),
  user: (
    <div className="wrap__menu-icon">
      <FaRegUser className="menu__icon !size-6 min-w-6" />
    </div>
  ),
  category: (
    <div className="wrap__menu-icon">
      <BiCategory className="menu__icon !size-6 min-w-6" />
    </div>
  ),
  variantType: (
    <div className="wrap__menu-icon">
      <IoFileTrayStackedOutline className="menu__icon !size-6 min-w-6" />
    </div>
  ),
  product: (
    <div className="wrap__menu-icon">
      <BsBox className="menu__icon !size-6 min-w-6" />
    </div>
  ),
  order: (
    <div className="wrap__menu-icon">
      <CiBoxes className="menu__icon !size-7 min-w-7" />
    </div>
  ),
  news: (
    <div className="wrap__menu-icon">
      <img
        src={NewsImg}
        alt="icon sidebar"
        title="icon sidebar"
        className="menu__icon object-contain"
      />
    </div>
  ),
};

export default sidebarIcons;
