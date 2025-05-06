import { API_VERSION, BASE_URL } from "~/common/api";
import AxiosClient from "~/config/axiosClient";
import { INTERNAL_PATH } from "~/config/constants";
import { parseQueryString } from "~/helper/url";
import {
  ICreateCategoryRequest,
  IGetCategoriesByIndexRequest,
  IGetCategoriesRequest,
  IUpdateCategoryRequest,
} from "~/page/Category/interfaces";

const apiCategoryService = {
  categories: async (paramater: Partial<IGetCategoriesRequest>) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/categories" +
        parseParamater,
    ).then((res) => res.data);
  },
  categoriesByIndex: async (
    paramater: Partial<IGetCategoriesByIndexRequest>,
  ) => {
    const parseParamater = parseQueryString(paramater);

    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/categories/follow-index" +
        parseParamater,
    ).then((res) => res.data);
  },
  category: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/categories/${id}`,
    ).then((res) => res.data);
  },
  childrenOfCategory: async (id: string) => {
    return await AxiosClient.get(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        `/admin/categories/children/${id}`,
    ).then((res) => res.data);
  },
  create: async (data: ICreateCategoryRequest) => {
    return await AxiosClient.post(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + "/admin/categories",
      data,
    ).then((res) => res.data);
  },
  update: async (id: string, data: IUpdateCategoryRequest) => {
    return await AxiosClient.patch(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/categories/${id}`,
      data,
    ).then((res) => res.data);
  },
  uploadThumbnail: async (file: File) => {
    const formData: FormData = new FormData();
    formData.append("file", file);

    return await AxiosClient.post(
      BASE_URL +
        API_VERSION.V1 +
        INTERNAL_PATH +
        "/admin/categories/upload-thumbnail",
      formData,
      {
        headers: {
          "Content-Type": file.type,
        },
      },
    ).then((res) => res.data);
  },
  delete: async (id: string) => {
    return await AxiosClient.delete(
      BASE_URL + API_VERSION.V1 + INTERNAL_PATH + `/admin/categories/${id}`,
    ).then((res) => res.data);
  },
};

export { apiCategoryService };
