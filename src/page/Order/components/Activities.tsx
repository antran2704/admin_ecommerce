import CollapseGroup from "./Collapse";

export const OrderActivities = () => {
  return (
    <CollapseGroup label="Activity">
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></div>
          <div>
            <p className="text-sm font-medium text-gray-900">10:00 AM</p>
            <p className="text-sm text-gray-700">Order created</p>
          </div>
        </div>
      </div>
    </CollapseGroup>
  );
};
