import axios from "axios";
import { IErrorResponse } from "~/interface";

const hanldeErrorAxios = (
  err: unknown,
): Pick<IErrorResponse, "message" | "statusCode"> => {
  if (!axios.isAxiosError(err)) {
    return { message: "Internal Server", statusCode: 500 };
  }

  const response = err.response;

  if (!response) {
    return { message: "Internal Server", statusCode: 500 };
  }

  return response.data;
};

export default hanldeErrorAxios;
