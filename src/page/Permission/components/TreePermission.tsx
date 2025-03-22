import React, { useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";

import permissionData from "~/permssions.json";
import { IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { IPermission } from "~/interface/permission";
import { useTranslation } from "react-i18next";

interface Props {
  data: string[];
  ability: {
    update: boolean;
  };
  onChange?: (values: string[]) => void;
}

const TreePermission = (props: Props) => {
  const { data, ability = { update: false }, onChange } = props;

  const { t, i18n } = useTranslation("Permission");

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    "ALL",
    "ADMIN",
    "PORTAL",
  ]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const handleGetTree = (payload: IPermission): TreeDataNode => {
    return {
      title: payload.title.includes(".")
        ? t(payload.title.split(".")[1])
        : t(payload.title),
      className: "text-base !py-3",
      key: payload.key,
      switcherIcon: (props) => (
        <IoIosArrowUp
          className={clsx(
            "text-xl text-gray-700 transition-all ease-linear duration-100",
            [
              props.expanded && "rotate-180",
              [payload.children && payload.children ? "block" : "hidden"],
            ],
          )}
        />
      ),
      isLeaf: !payload.children || !payload.children.length,
      disabled: !ability.update,
      children:
        payload.children &&
        payload.children.map((item: IPermission) => handleGetTree(item)),
    };
  };

  const treeAdmin: TreeDataNode = handleGetTree({
    title: "WEB ADMIN",
    key: "ADMIN",
    children: permissionData.ADMIN,
  });

  const treePortal: TreeDataNode = handleGetTree({
    title: "PORTAL & APP",
    key: "PORTAL",
    children: permissionData.PORTAL,
  });

  const treeData: TreeDataNode[] = useMemo(
    (): TreeDataNode[] => [
      {
        title: t("ALL"),
        key: "ALL",
        className: "text-base !py-3",
        switcherIcon: (props) => (
          <IoIosArrowUp
            className={clsx(
              "text-xl text-gray-700 transition-all ease-linear duration-100",
              [props.expanded && "rotate-180"],
            )}
          />
        ),
        children: [treeAdmin, treePortal],
        disabled: !ability.update,
      },
    ],
    [data, expandedKeys, checkedKeys, i18n.resolvedLanguage],
  );

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps["onCheck"] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[]);

    if (onChange) {
      onChange(checkedKeysValue as string[]);
    }
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeysValue) => {
    setSelectedKeys(selectedKeysValue);
  };

  useEffect(() => {
    if (data) {
      setCheckedKeys(data);
      setAutoExpandParent(true);
    }
  }, [data]);

  return (
    <Tree.DirectoryTree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
      showIcon={false}
    />
  );
};

export default TreePermission;
