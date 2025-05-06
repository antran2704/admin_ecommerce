import { Badge, Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { GoBell } from "react-icons/go";
import { IoCheckmarkDone } from "react-icons/io5";
import dayjs from "dayjs";

import { DAY_DMY } from "~/common/format";

const exampleData: any[] = [
  {
    id: "1",
    key: "1",
    title: "Notification 1",
    description: "Content 1",
    createdAt: new Date().toISOString(),
    admin: "Admin 1",
  },
  {
    id: "2",
    key: "2",
    title: "Notification 2",
    description: "Content 2",
    createdAt: new Date().toISOString(),
    admin: "Admin 2",
  },
  {
    id: "3",
    key: "3",
    title: "Notification 3",
    description: "Content 3",
    createdAt: new Date().toISOString(),
    admin: "Admin 3",
  },
];

const Notification = () => {
  const { t } = useTranslation("Navbar");

  return (
    <Dropdown
      placement="bottomLeft"
      trigger={["click"]}
      dropdownRender={() => (
        <div className="w-[500px] bg-white p-5 rounded-lg shadow-lg ">
          <div className="flex items-center justify-between gap-5">
            <p className="text-base font-semibold text-primary-color">
              {t("notification")}
            </p>

            <IoCheckmarkDone className="text-2xl text-primary-color cursor-pointer" />
          </div>
          <ul className="scroll flex flex-col pt-5 2xl:max-h-[600px] max-h-[400px] overflow-y-auto gap-3">
            {exampleData.map((item) => (
              <li
                key={item.id}
                className="p-3 bg-[#E9E9E9] border shadow-md rounded-md cursor-pointer"
              >
                <div className="flex items-center justify-between gap-5">
                  <p className="text-sm font-medium line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs">
                    {dayjs(item.createdAt).format(DAY_DMY)}
                  </p>
                </div>
                <p className="text-sm mt-2 line-clamp-3">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      overlayClassName="menu"
    >
      <div className="flex items-center justify-center bg-[#F4F4F4] dark:bg-gray-500 h-10 w-10 rounded-lg">
        <Badge count={2}>
          <GoBell className="text-2xl text-[#ADB5BD] dark:text-white hover:text-primary-300 cursor-pointer" />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default Notification;
