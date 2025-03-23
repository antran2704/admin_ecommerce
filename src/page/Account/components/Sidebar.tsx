import { useState, Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";

import "./Account.scss";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUserAsyncThunk } from "~/store/slice/user";

import ChangePasswordModal from "./ChangePasswordModal";
import Avartar from "~/components/Avartar";
import ChangePassword from "~/components/ChangePassword";
import MESSAGE_ERROR from "~/common/error";

interface Props {
  isEdit: boolean;
}

const SidebarAccount = (props: Props) => {
  const { isEdit } = props;

  const { t: tError } = useTranslation("Error");
  const { t: tSuccess } = useTranslation("Success");

  const { infoUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [avartar, setAvartar] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<{ avartar: boolean }>({
    avartar: false,
  });

  const [messageApi, contextHolder] = message.useMessage();

  const onModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onLoading = (key: keyof typeof loading, value: boolean) => {
    setLoading({ ...loading, [key]: value });
  };

  const handleChangeImage = async (file: File | null) => {
    if (!file) return;

    onLoading("avartar", true);
    try {
      const fileName: string = infoUser.avaratar
        ? infoUser.avaratar
        : file.lastModified.toString();

      // const newUrl: string = await presignedPutUrlProfile(fileName);

      // if (!newUrl) return;

      // await axios.put(newUrl, file, {
      //   headers: {
      //     "Content-Type": file.type,
      //   },
      // });

      dispatch(fetchUserAsyncThunk()).then(() => {
        messageApi.success(tSuccess("update"));
      });
    } catch (error) {
      messageApi.error(tError(MESSAGE_ERROR.TRY_AGAIN));
    }

    onLoading("avartar", false);
  };

  useEffect(() => {
    if (infoUser.userId && infoUser.avaratar) {
      setAvartar(infoUser.avaratar);
    }
  }, [infoUser]);

  return (
    <Fragment>
      <div className="flex flex-col items-center">
        <Avartar
          avartar={avartar}
          disabled={!isEdit}
          loading={loading.avartar}
          className="rounded-full"
          onChangeImage={handleChangeImage}
        />

        {infoUser.userId && isEdit && (
          <ChangePassword onModal={onModal}>
            <ChangePasswordModal open={isModalOpen} onCancel={onModal} />
          </ChangePassword>
        )}
      </div>

      {/* message Antd */}
      {contextHolder}
    </Fragment>
  );
};

export default SidebarAccount;
