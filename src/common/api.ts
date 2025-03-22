const API_VERSION = {
  V1: "/v1",
  V2: "/v2",
};

const BASE_URL: string = import.meta.env.VITE_API_ENDPOINT as string;

export { API_VERSION, BASE_URL };
