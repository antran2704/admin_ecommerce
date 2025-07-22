import { OrderHeader } from "./OrderHeader";
import { OrderPaymentSummary } from "./PaymentSummary";

export function EditContent() {
  const order = {
    id: "#1002",
    status: "Paid",
    fulfillment: "Unfulfilled",
    date: "06.22.2019 at 10:14 am",
    items: [
      {
        name: "Nike Air Force 1 LV8 2",
        color: "Black-Pink",
        shoelaces: "Black",
        size: "US 10",
        originalPrice: 136.0,
        discountedPrice: 80.0,
        quantity: 1,
        image: "https://placehold.co/80x80/E0E0E0/000000?text=Nike",
      },
      {
        name: "UNITED STANDARD - Long Hoodie",
        color: "Black",
        size: "US 10",
        originalPrice: 234.0,
        discountedPrice: 234.0,
        quantity: 1,
        image: "https://placehold.co/80x80/E0E0E0/000000?text=Hoodie",
      },
    ],
    delivery: {
      provider: "Fedex",
      type: "First class package",
      cost: 20.0,
    },
    paymentSummary: {
      subtotal: 314.0,
      itemCount: 2,
      delivery: 20.0,
      tax: 0.0, // Assuming 0.00 from image
      totalPaid: 334.0,
    },
    customer: {
      name: "Eugenia Bates",
      avatar: "https://placehold.co/40x40/E0E0E0/000000?text=EB",
      ordersCount: 5,
      contact: {
        email: "eugenia.bates@gmail.com",
        phone: "+1 (223) 123-1234",
      },
      shippingAddress: {
        name: "Eugenia Bates",
        phone: "+1 (223) 123-1234",
        street: "Sawayn Oval, 605",
        city: "New York",
        zip: "12101",
        country: "United States",
      },
      billingAddress: {
        name: "Eugenia Bates",
        phone: "+1 (223) 123-1234",
        street: "Sawayn Oval, 605",
        city: "New York",
        zip: "12101",
        country: "United States",
      },
    },
    activity: [
      { type: "today", time: "10:00 AM", description: "Order created" },
      { type: "yesterday", time: "09:30 AM", description: "Payment received" },
    ],
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Section: Order Details */}
      <div className="flex-1 p-6 border-r border-gray-200">
        <OrderHeader />

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-200">
          <div className="flex items-center text-orange-700 mb-4">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.3 2.671-1.3 3.436 0L14.463 8.5c.765 1.3-.17 2.99-1.718 2.99H7.255c-1.548 0-2.483-1.69-1.718-2.99l2.72-5.401z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="font-semibold">
              {order.fulfillment} {order.items.length}
            </span>
          </div>
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-t border-gray-200 first:border-t-0"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  {item.shoelaces && (
                    <p className="text-sm text-gray-600">
                      Shoelaces: {item.shoelaces}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end">
                  {item.originalPrice &&
                    item.originalPrice > item.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(item.originalPrice)}
                      </span>
                    )}
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(item.discountedPrice)}
                  </span>
                </div>
                <span className="text-gray-700">x{item.quantity}</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(item.discountedPrice * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <OrderPaymentSummary />

        {/* Activity */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity</h3>
          <div className="space-y-4">
            {order.activity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.time}
                  </p>
                  <p className="text-sm text-gray-700">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Customer Details */}
      <div className="lg:w-96 bg-white p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer</h2>

        {/* Customer Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={order.customer.avatar}
              alt={order.customer.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium text-gray-900">
              {order.customer.name}
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Customer Orders */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              ></path>
            </svg>
            <span className="text-gray-700">
              {order.customer.ordersCount} Orders
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Contact Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact info
        </h3>
        <div className="space-y-3 text-gray-700 mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"
              ></path>
            </svg>
            <span>{order.customer.contact.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            <span>{order.customer.contact.phone}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Shipping Address
        </h3>
        <div className="space-y-1 text-gray-700 mb-6">
          <p>{order.customer.shippingAddress.name}</p>
          <p>{order.customer.shippingAddress.phone}</p>
          <p>{order.customer.shippingAddress.street}</p>
          <p>{order.customer.shippingAddress.city}</p>
          <p>{order.customer.shippingAddress.zip}</p>
          <p>{order.customer.shippingAddress.country}</p>
        </div>

        {/* Billing Address */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Billing Address
        </h3>
        <div className="space-y-1 text-gray-700">
          <p>{order.customer.billingAddress.name}</p>
          <p>{order.customer.billingAddress.phone}</p>
          <p>{order.customer.billingAddress.street}</p>
          <p>{order.customer.billingAddress.city}</p>
          <p>{order.customer.billingAddress.zip}</p>
          <p>{order.customer.billingAddress.country}</p>
        </div>
      </div>
    </div>
  );
}
