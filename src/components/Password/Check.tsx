import clsx from "clsx";
import { ICheckPassword } from "~/interface/password";

import CirleIcon from "@assets/icons/circle.png";
import FillCirleIcon from "@assets/icons/filled_circle.png";

interface Props {
  listCheck: ICheckPassword[];
  listValid: number[];
  className?: string;
}

const CheckPassword = (props: Props) => {
  const { listCheck, listValid, className } = props;

  return (
    <ul className={clsx(className)}>
      {listCheck.map((item) => (
        <li key={item.id} className="flex items-center gap-2">
          {!listValid.includes(item.id) && (
            <img src={CirleIcon} alt="circle icon" className="size-4" />
          )}
          {listValid.includes(item.id) && (
            <img src={FillCirleIcon} alt="circle icon" className="size-4" />
          )}
          <p className="text-sm text-[#4C4A53]">{item.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default CheckPassword;
