import { Button, Modal, ModalProps } from "antd";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BtnFilter } from "~/components/Button";

interface Props extends ModalProps {
  filter: any;
  children: JSX.Element;
  onClearFilter: () => void;
  onFilter: () => void;
}

const FilterCore = (props: Props) => {
  const { title, children, onClearFilter, onFilter, ...rest } = props;

  const { t: tFilter } = useTranslation("Filter");

  const [showFilter, setShowFilter] = useState<boolean>(false);

  const onShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleClearFilter = () => {
    onClearFilter();
    // setShowFilter(false);
  };

  const handleFilter = () => {
    onFilter();
    setShowFilter(false);
  };

  return (
    <Fragment>
      <BtnFilter onClick={onShowFilter} />
      <Modal
        title={<h4 className="text-xl font-bold">{title}</h4>}
        {...rest}
        centered={true}
        open={showFilter}
        onCancel={onShowFilter}
        destroyOnClose={true}
        closeIcon={<IoIosCloseCircleOutline className="size-7" />}
        footer={null}
      >
        <div className="flex flex-col pt-5 gap-4">{children}</div>
        <div className="sticky -bottom-5 w-full flex item justify-center bg-white/60 backdrop-blur-sm pt-10 gap-5">
          <Button
            onClick={handleClearFilter}
            size="large"
            className="md:w-[120px] w-full"
          >
            {tFilter("cancel")}
          </Button>
          <Button
            size="large"
            type="primary"
            onClick={handleFilter}
            className={clsx("md:w-[120px] w-full")}
          >
            {tFilter("apply")}
          </Button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default FilterCore;
