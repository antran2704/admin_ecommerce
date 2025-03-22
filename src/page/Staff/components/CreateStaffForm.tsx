import Avartar from "~/components/Avartar";
import { InforForm } from "./index";
import { UseFormReturn } from "react-hook-form";
import { IFormStaff } from "~/interface/staff";
import ability from "~/context/ability";
import { EPageRole, EPermisisonAction } from "~/enum/constants";

interface Props {
  dataForm: UseFormReturn<IFormStaff, any, undefined>;
  onChangeAvartar: (file: File | null) => void;
}

const CreateStaffForm = (props: Props) => {
  const { dataForm, onChangeAvartar } = props;

  return (
    <div className="flex lg:flex-row flex-col items-start justify-between py-10 gap-10">
      <div className="mx-auto">
        <div className="flex flex-col items-center">
          <Avartar
            disabled={
              !ability.can(
                EPermisisonAction.PRE_SIGNED_PUT_URL,
                EPageRole.ADMIN_PAGE_MANAGE_USER,
              )
            }
            className="!rounded-full"
            onChangeImage={onChangeAvartar}
          />
        </div>
      </div>

      {/* Form */}
      <div className="xl:w-10/12 w-full px-5">
        <InforForm form={dataForm} />
      </div>
    </div>
  );
};

export default CreateStaffForm;
