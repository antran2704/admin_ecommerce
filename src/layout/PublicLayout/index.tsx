import { Suspense, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getAuthToken, removeAuthToken } from "~/helper/auth";
import LocaleSwitcher from "~/components/LocaleSwitcher";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { fetchUserAsyncThunk, selectUserSlice } from "~/store/slice/user";
import SpinnerLoading from "~/components/Loading/Spinner";

const PublicLayout = () => {
  const navigate = useNavigate();
  const { infoUser } = useAppSelector(selectUserSlice);

  const dispatch = useAppDispatch();

  const chechAuth = async () => {
    const accessToken = getAuthToken("accessToken");
    const refreshToken = getAuthToken("refreshToken");

    if (!accessToken || !refreshToken) {
      removeAuthToken();
      return;
    }

    dispatch(fetchUserAsyncThunk());
  };

  useEffect(() => {
    if (!infoUser.userId) {
      chechAuth();
    } else {
      navigate("/");
    }
  }, [infoUser]);

  return (
    <div className="w-full h-screen flex flex-col">
      {/* form */}
      <div className="h-[90%] w-full flex items-center justify-center ">
        <div className="2xl:h-[600px] h-[540px] 2xl:w-[500px] lg:w-[440px] md:w-1/2 sm:w-2/3 w-11/12 bg-white px-8 py-10 rounded-3xl border border-[#B5B5B5] gap-5">
          <Suspense
            fallback={
              <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white z-[9999]">
                <SpinnerLoading size="L" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </div>

      <div className="w-full flex items-center justify-center mt-auto p-5 gap-5">
        <LocaleSwitcher />
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-primary-color"
        >
          Cookie
        </Link>
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-primary-color"
        >
          Điều khoản
        </Link>
        <Link
          to={"/"}
          className="md:text-sm sm:text-sm text-xs text-[#202020] hover:underline hover:text-primary-color"
        >
          Riêng tư
        </Link>
      </div>
    </div>
  );
};

export default PublicLayout;
