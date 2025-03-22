import { Link } from "react-router-dom";
const env = import.meta.env.VITE_ENVIRONMENT as string;

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="md:text-2xl text-xl text-center py-5">
        {env === "production"
          ? "404 - Trang không tồn tại, vui lòng kiểm tra lại đường dẫn"
          : "Đi lộn trang rồi baby lêu lêu, hư quá!"}
      </h1>
      <Link to="/" className="text-primary-200 underline">
        {env === "production" ? "Về trang chủ" : "Về trang chủ nek baby"}
      </Link>
    </div>
  );
};

export default NotFoundPage;
