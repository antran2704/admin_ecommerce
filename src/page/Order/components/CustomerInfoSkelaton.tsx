export const OrderCustomerInfoSkelaton = () => {
  return (
    <div className="flex flex-col lg:w-96 bg-white border-b lg:border-b-0 lg:border-l border-gray-200 lg:pl-6 pb-4 gap-6">
      <h2 className="w-1/2 h-5 animate-pulse bg-gray-300 rounded" />

      {/* Customer Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <p className="size-10 animate-pulse bg-gray-300 rounded-full" />
          <p className="w-[100px] h-5 animate-pulse bg-gray-300 rounded" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {/* Contact Info */}
        <h2 className="w-1/2 h-5 animate-pulse bg-gray-300 rounded" />
        <p className="w-1/3 h-5 animate-pulse bg-gray-300 rounded" />
        <p className="w-2/3 h-5 animate-pulse bg-gray-300 rounded" />
      </div>

      <div className="flex flex-col gap-2">
        {/* Contact Info */}
        <h2 className="w-1/2 h-5 animate-pulse bg-gray-300 rounded" />
        <p className="w-1/3 h-5 animate-pulse bg-gray-300 rounded" />
        <p className="w-2/3 h-5 animate-pulse bg-gray-300 rounded" />
      </div>
    </div>
  );
};
