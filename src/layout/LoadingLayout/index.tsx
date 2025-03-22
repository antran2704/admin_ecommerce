import { Fragment } from "react/jsx-runtime";
import SpinnerLoading from "~/components/Loading/Spinner";

interface Props {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingLayout = (props: Props) => {
  const { children, loading = false } = props;
  return (
    <Fragment>
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/50 backdrop-blur-md z-50">
          <SpinnerLoading size="L" />
        </div>
      )}

      {!loading && children}
    </Fragment>
  );
};

export default LoadingLayout;
