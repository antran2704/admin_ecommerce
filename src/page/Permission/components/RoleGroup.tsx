import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { IoMdAddCircleOutline } from "react-icons/io";

import { RoleItem } from "./index";

import NotFoundImage from "@assets/images/PermissionPage/not_found.png";
import { IRoleItem } from "../interfaces";

interface Props {
  title: string;
  data: IRoleItem[];
  selectedValue?: string | null;
  showBtnAdd?: boolean;
  notFoundMsg?: string;
  ability: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  onModalAdd?: () => void;
  onSelectValue?: (id: string) => void;
  onUpdateValue?: (id: string, value: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const RoleGroup = (props: Props) => {
  const {
    title,
    data,
    selectedValue,
    showBtnAdd = true,
    notFoundMsg,
    ability = {
      create: false,
      delete: false,
      update: false,
    },
    onModalAdd,
    onSelectValue,
    onUpdateValue,
    onDelete,
  } = props;

  const { t: tCommon } = useTranslation("Common");

  return (
    <div className="px-5 pb-5 pt-8 bg-white rounded-lg">
      <h2 className="md:text-lg text-base font-medium text-green-500 pb-2 px-2 border-b border-b-gray-200/50">
        {title}
      </h2>

      <ul className="scroll pt-5 xl:h-[500px] h-[400px] overflow-y-auto">
        {data.length > 0 &&
          data.map((item) => (
            <RoleItem
              key={item.id}
              data={item}
              ability={ability}
              selectedValue={selectedValue}
              onSelectValue={onSelectValue}
              onUpdate={onUpdateValue}
              onDelete={onDelete}
            />
          ))}

        {!data.length && (
          <li className="flex flex-col items-center py-2 px-10 justify-center gap-5">
            <img
              src={NotFoundImage}
              alt="Not found permission"
              title="Not found permission"
              className="object-contain w-[200px]"
            />
            <p className="lg:w-3/4 w-full md:text-base text-sm font-medium text-gray-700 text-center">
              {notFoundMsg}
            </p>
          </li>
        )}
      </ul>
      {/* ability.can(EPermisisonAction.CREATE, EPageRole.ADMIN_PAGE_GROUP) */}
      {showBtnAdd && ability.create && (
        <Button
          type="text"
          size="large"
          className="mt-2"
          onClick={onModalAdd}
          icon={<IoMdAddCircleOutline className="text-xl text-green-500" />}
        >
          {tCommon("add")}
        </Button>
      )}
    </div>
  );
};

export default RoleGroup;
