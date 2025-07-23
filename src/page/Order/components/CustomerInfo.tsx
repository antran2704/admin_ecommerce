import { useTranslation } from "react-i18next";

export const OrderCustomerInfo = () => {
  const { t } = useTranslation("OrderPage");

  return (
    <div className="lg:w-96 bg-white p-6 border-t lg:border-t-0 lg:border-l border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("customer")}</h2>

      {/* Customer Profile */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img
            src={"https://placehold.co/40x40/E0E0E0/000000?text=EB"}
            alt="Eugenia Bates"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">Eugenia Bates</span>
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
        {t("contactInfo")}
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
          <span>eugenia.bates@gmail.com</span>
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
          <span>+1 (223) 123-1234</span>
        </div>
      </div>

      {/* Shipping Address */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("shippingAddress")}
      </h3>
      <div className="space-y-1 text-gray-700 mb-6">
        <p>Sawayn Oval, 605</p>
      </div>
    </div>
  );
};
