import { useEffect, useMemo, useState } from "react";
import type { GetProp, TreeSelectProps } from "antd";
import { TreeSelect } from "antd";
import { useTranslation } from "react-i18next";
import { Controller, UseFormReturn } from "react-hook-form";

import { useCategoriesByIndex } from "../hooks";
import {
  ICategoryForm,
  ICategoryResponse,
  IChildCategoryResponse,
  IGetCategoriesByIndexRequest,
} from "../interfaces";
import { apiCategoryService } from "~/api-client/category";
import useMessageAntd from "~/hooks/useMessageAntd";
import FormField from "~/components/Core/Input/FormField";
import MESSAGE_ERROR from "~/common/errorMessage";

type DefaultOptionType = GetProp<TreeSelectProps, "treeData">[number];

interface Props {
  data?: ICategoryResponse;
  form: UseFormReturn<ICategoryForm, any, undefined>;
  isEdit?: boolean;
}

const TreeCategories = (props: Props) => {
  const { data, isEdit, form } = props;

  const {
    control,
    formState: { errors },
  } = form;

  const { t } = useTranslation("CategoryPage");
  const { t: tError } = useTranslation("Error");
  const { messageAntd } = useMessageAntd();

  const [treeData, setTreeData] = useState<Omit<DefaultOptionType, "label">[]>(
    [],
  );
  const [disableIds, setDisableIds] = useState<string[]>([]);

  //   Get parent categories
  const parentCategoriesParamater: IGetCategoriesByIndexRequest = useMemo(
    (): IGetCategoriesByIndexRequest => ({
      index: 0,
    }),
    [],
  );
  const { categories } = useCategoriesByIndex(parentCategoriesParamater);

  const onLoadData: TreeSelectProps["loadData"] = async ({ id }) => {
    try {
      const children: IChildCategoryResponse[] =
        await apiCategoryService.childrenOfCategory(id);

      const newData = children.map((item) => ({
        id: item.categoryId,
        pId: id,
        value: item.categoryId,
        title: item.categoryName,
        isLeaf: item.childrenCount > 0 ? false : true,
        disabled:
          item.categoryId === data?.categoryId || disableIds.includes(id),
      }));

      // Remove duplicate
      const newTreeData = treeData.filter((item) => {
        const isDuplicate = newData.some((x) => x.id === item.id);

        if (!isDuplicate) return item;
      });

      if (id === data?.categoryId || disableIds.includes(id)) {
        const newDisableIds = newData
          .filter((item) => !disableIds.includes(item.id))
          .map((item) => item.id);
        setDisableIds([...disableIds, ...newDisableIds]);
      }

      const mergeData = [...newTreeData, ...newData];
      setTreeData(mergeData);
    } catch (error) {
      console.log(error);
      messageAntd.error(t("error.GET_CHILDREN_CATEGORY_ERROR"));
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      const data = categories.map((item) => ({
        id: item.categoryId,
        pId: 0,
        value: item.categoryId,
        title: item.categoryName,
        isLeaf: item.childrenCount > 0 ? false : true,
      }));

      setTreeData([
        {
          id: "root",
          pId: 0,
          value: "root",
          title: t("form.root"),
          isLeaf: true,
        },
        ...data,
      ]);
    }
  }, [categories]);

  useEffect(() => {
    if (!data) return;

    if (data.categoryParentId && treeData.length > 0) {
      const parent = treeData.find((item) => item.id === data.categoryParentId);

      if (!parent) {
        setTreeData([
          ...treeData,
          {
            id: data.categoryParentId,
            pId: 0,
            value: data.categoryParentId,
            title: data.categoryParentName,
            isLeaf: true,
            disabled: true,
            selectable: false,
          },
        ]);
      }
    }
  }, [data, treeData]);

  useEffect(() => {
    if (!data) return;

    const newDisableIds: string[] = [];

    if (data.categoryId) {
      newDisableIds.push(data.categoryId);
    }

    // if (data.categoryParentId) {
    //   newDisableIds.push(data.categoryParentId);
    // }

    setDisableIds(newDisableIds);
  }, [data]);

  return (
    <Controller
      name="parentId"
      control={control}
      render={({ field: { value, onChange } }) => (
        <FormField
          sizeText="small"
          title={t("form.parent")}
          error={!!errors.parentId}
          errorMessage={errors.parentId?.message}
        >
          <TreeSelect
            size="large"
            treeDataSimpleMode
            style={{ width: "100%" }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder={tError(MESSAGE_ERROR.PLEASE_SELECT)}
            onChange={onChange}
            loadData={onLoadData}
            treeData={treeData}
            showSearch
            allowClear
            disabled={!isEdit}
          />
        </FormField>
      )}
    />
  );
};

export default TreeCategories;
