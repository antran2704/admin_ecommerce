import { OrderActivities } from "./Activities";
import { OrderCustomerInfo } from "./CustomerInfo";
import { OrderHeader } from "./OrderHeader";
import { OrderItemList } from "./OrderItemList";
import { OrderPaymentSummary } from "./PaymentSummary";

export function EditContent() {
  return (
    <div className="bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section: Order Details */}
      <div className="flex-1 flex flex-col p-6 lg:border-r border-gray-200 gap-6">
        <OrderHeader />

        {/* Order Items */}
        <OrderItemList />

        {/* Payment Summary */}
        <OrderPaymentSummary />

        {/* Activity */}
        <OrderActivities />
      </div>

      {/* Right Section: Customer Details */}
      <OrderCustomerInfo />
    </div>
  );
}
