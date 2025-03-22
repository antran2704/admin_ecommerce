import clsx from "clsx";
import { ETypeFile } from "~/enum/file";
import { UploadImage } from "../Core";

interface Props {
  avartar?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  error?: boolean;
  onChangeImage?: (file: File | null) => void;
}

const Avartar = (props: Props) => {
  const {
    avartar,
    loading,
    disabled = false,
    className,
    error,
    onChangeImage,
  } = props;

  return (
    <UploadImage
      src={avartar}
      className={clsx(
        "lg:!w-[180px] border-dashed lg:min-w-[180px] lg:!h-[180px] min-w-[260px] w-[260px] !h-[260px]",
        className,
      )}
      disabled={disabled}
      loading={loading}
      error={error}
      onChangeImage={onChangeImage}
      rules={[ETypeFile.JPEG, ETypeFile.PNG, ETypeFile.WEBP]}
    />
  );
};

export default Avartar;
