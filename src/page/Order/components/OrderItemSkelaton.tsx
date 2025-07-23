export const OrderItemSkelaton = () => {
  return (
    <div className="border rounded-lg p-4 shadow-sm animate-pulse bg-white space-y-4">
      {/* Header: order code + status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded-sm" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
        <div className="h-6 w-20 bg-gray-300 rounded-full" />
      </div>

      {/* Product section */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-48 bg-gray-300 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Total + button */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-40 bg-gray-300 rounded" />
        <div className="h-9 w-20 bg-gray-300 rounded-md" />
      </div>
    </div>
  );
};
