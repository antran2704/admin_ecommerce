import { useState, Fragment } from "react";
import { UseFormReturn } from "react-hook-form";
import clsx from "clsx";

import { useAppSelector } from "~/store/hooks";

import ChangePasswordModal from "./ChangePasswordModal";
import ChangePassword from "~/components/ChangePassword";
import { IProfileForm } from "../interfaces";
import { UploadImage } from "~/components/Core";
import { ETypeFile } from "~/enum/file";

interface Props {
  isEdit: boolean;
  form: UseFormReturn<IProfileForm, any, undefined>;
}

const SidebarAccount = (props: Props) => {
  const { isEdit, form } = props;
  const { setValue } = form;
  const { infoUser } = useAppSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChangeImage = async (file: File | null) => {
    if (!file) {
      setValue("avatar", "");
    }

    setValue("avatarFile", file);
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center">
        <UploadImage
          src={infoUser.avatar}
          className={clsx(
            "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px] rounded-full",
          )}
          disabled={!isEdit}
          onChangeImage={handleChangeImage}
          rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
        />

        {infoUser.userId && isEdit && (
          <ChangePassword onModal={onModal}>
            <ChangePasswordModal open={isModalOpen} onCancel={onModal} />
          </ChangePassword>
        )}
      </div>
    </Fragment>
  );
};

export default SidebarAccount;
