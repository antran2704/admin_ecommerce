import { FaRegUser } from "react-icons/fa";

import dashboardImg from "~/assets/images/Sidebar/dashboard.png";
import permissionImg from "~/assets/images/Sidebar/permission.png";
import staffImg from "~/assets/images/Sidebar/staff.png";
import categoryImg from "~/assets/images/Sidebar/category.png";
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
      <FaRegUser className="menu__icon !size-5 min-w-5" />
    </div>
  ),
  category: (
    <div className="wrap__menu-icon">
      <img
        src={categoryImg}
        alt="icon sidebar"
        title="icon sidebar"
        className="menu__icon object-contain"
      />
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
