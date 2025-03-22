import { UseFormReturn } from "react-hook-form";
import Avartar from "~/components/Avartar";
import ChangePassword from "~/components/ChangePassword";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";
import { IFormStaff, IStaff } from "~/interface/staff";
import { ChangePasswordStaffModal, InforForm } from "./index";
import { useTranslation } from "react-i18next";

interface Props {
  dataForm: UseFormReturn<IFormStaff, any, undefined>;
  data: IStaff | null;
  isEdit: boolean;
  isOpenPasswordModal: boolean;
  onModalChangePassword: (value: boolean) => void;
  onChangeAvartar: (file: File | null) => void;
}

const UpdateStaffForm = (props: Props) => {
  const {
    dataForm,
    data,
    isEdit,
    isOpenPasswordModal,
    onModalChangePassword,
    onChangeAvartar,
  } = props;

  const { t } = useTranslation("StaffPage");

  return (
    <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
      <div className="mx-auto">
        {data && (
          <div className="flex flex-col items-center">
            <Avartar
              avartar={data.imageProfile?.url}
              disabled={
                !ability.can(
                  EPermisisonAction.PRE_SIGNED_PUT_URL,
                  EPageRole.ADMIN_PAGE_MANAGE_USER,
                ) || !isEdit
              }
              className="!rounded-full"
              onChangeImage={onChangeAvartar}
            />

            {isEdit &&
              ability.can(
                EPermisisonAction.CHANGE_PASSWORD,
                EPageRole.ADMIN_PAGE_MANAGE_USER,
              ) && (
                <ChangePassword onModal={() => onModalChangePassword(true)}>
                  <ChangePasswordStaffModal
                    staff={data}
                    open={isOpenPasswordModal}
                    onCancel={() => onModalChangePassword(false)}
                  />
                </ChangePassword>
              )}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="xl:w-10/12 w-full px-5">
        <InforForm isEdit={isEdit} form={dataForm} data={data} />
      </div>
    </div>
  );
};

export default UpdateStaffForm;
