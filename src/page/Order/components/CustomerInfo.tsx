import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiPhone } from "react-icons/fi";
import { CiMail } from "react-icons/ci";

import { IOrderResponse } from "../interfaces";

interface IProps {
  order: IOrderResponse;
}

export const OrderCustomerInfo = ({ order }: IProps) => {
  const { t } = useTranslation("OrderPage");

  return (
    <div className="flex flex-col lg:w-96 bg-white border-b lg:border-b-0 lg:border-l border-gray-200 lg:pl-6 pb-4 gap-6">
      <h2 className="text-lg font-bold text-gray-900">{t("customer")}</h2>

      {/* Customer Profile */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={"https://placehold.co/40x40/E0E0E0/000000?text=EB"}
            alt={order?.shippingInfomation?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium text-gray-900">
            {order?.shippingInfomation?.name}
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

      <div>
        {/* Contact Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("contactInfo")}
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <CiMail className="size-5" />
            <span>eugenia.bates@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiPhone className="size-5" />
            <Link
              to={`tel:${order?.shippingInfomation?.phoneNumber}`}
              className="hover:text-primary-color"
            >
              +{order?.shippingInfomation?.phoneNumber}
            </Link>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("shippingAddress")}
        </h3>
        <div className="space-y-1 text-gray-700">
          <p>{order?.shippingInfomation?.address}</p>
        </div>
      </div>

      {/* Note */}
      {order?.note && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("note")}
          </h3>
          <div className="space-y-1 text-gray-700">
            <p>{order.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};
