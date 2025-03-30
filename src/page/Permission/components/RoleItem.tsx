import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BtnCheck, BtnClose, BtnEdit, BtnTrash } from "~/components/Button";
import { InputText } from "~/components/Core/Input";
import { ModalConfirm } from "~/components/Modal";
import { IRoleItem } from "../interfaces";

interface Props {
  data: IRoleItem;
  selectedValue?: string | null;
  ability: {
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  onSelectValue?: (id: string) => void;
  onUpdate?: (id: string, value: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const RoleItem = (props: Props) => {
  const {
    data,
    selectedValue = null,
    ability = {
      create: false,
      delete: false,
      update: false,
    },
    onSelectValue,
    onUpdate,
    onDelete,
  } = props;

  const { t } = useTranslation("PermissionPage");
  const { t: tCommon } = useTranslation("Common");

  const [value, setValue] = useState<string>(data.name);
  const [valueInp, setValueInp] = useState<string>(data.name);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const [modal, setModal] = useState<{ delete: boolean }>({ delete: false });
  const [loading, setLoading] = useState<{ delete: boolean; update: boolean }>({
    delete: false,
    update: false,
  });

  const onModal = (key: keyof typeof modal, value: boolean) => {
    setModal({ ...modal, [key]: value });
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInp(e.target.value);
  };

  const onSave = async () => {
    if (!valueInp) return;
    onLoading("update", true);

    if (onUpdate) await onUpdate(data.id, valueInp);
    setValue(valueInp);
    setIsEdit(false);

    onLoading("update", false);
  };

  const onDeleteItem = async () => {
    onLoading("delete", true);

    if (onDelete) await onDelete(data.id);

    onLoading("delete", false);
    onModal("delete", false);
  };

  const onCancel = () => {
    setValueInp(value);
    setIsEdit(false);
  };

  return (
    <li
      className={clsx(
        "flex items-center p-2 justify-between hover:bg-[#F6FBFF] rounded-sm cursor-pointer gap-5",
        [selectedValue === data.id && "bg-[#F6FBFF]"],
      )}
      onClick={() => onSelectValue && onSelectValue(data.id)}
    >
      {!isEdit && <p className="text-base text-gray-700">{value}</p>}
      {isEdit && (
        <InputText
          size="middle"
          error={!valueInp}
          value={valueInp}
          disabled={loading.update}
          onClick={(e) => e.stopPropagation()}
          onPressEnter={onSave}
          onChange={onChangeValue}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex items-center z-10"
      >
        {!isEdit && (
          <Fragment>
            {ability.update && <BtnEdit onClick={handleEdit} />}
            {ability.delete && (
              <BtnTrash onClick={() => onModal("delete", true)} />
            )}

            <MdOutlineKeyboardArrowRight className="text-2xl" />
          </Fragment>
        )}

        {isEdit && (
          <Fragment>
            <BtnCheck
              disabled={loading.delete || loading.update}
              onClick={onSave}
            />
            <BtnClose
              disabled={loading.delete || loading.update}
              onClick={onCancel}
            />
          </Fragment>
        )}
      </div>

      <ModalConfirm
        title={t("modalDelete.title")}
        subtitle={t("modalDelete.subtitle")}
        open={modal.delete}
        type="error"
        onCancel={(e) => {
          e.stopPropagation();
          onModal("delete", false);
        }}
        onOk={(e) => {
          e.stopPropagation();
          onDeleteItem();
        }}
        destroyOnClose={true}
        okText={tCommon("confirm")}
        okButtonProps={{
          disabled: loading.delete,
          loading: loading.delete,
        }}
        cancelText={tCommon("goBack")}
      />
    </li>
  );
};

export default RoleItem;
